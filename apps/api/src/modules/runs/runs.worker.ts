import { Injectable, Logger } from "@nestjs/common";
import { BillingService } from "../billing/billing.service.js";
import { AgentRuntimeService } from "../agent-runtime/agent-runtime.service.js";
import { LlmGateway } from "../llm/llm.gateway.js";
import { PrismaService } from "../shared/prisma.service.js";
import { RunsEvents } from "./runs.events.js";

@Injectable()
export class RunsWorker {
  private readonly logger = new Logger(RunsWorker.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
    private readonly llmGateway: LlmGateway,
    private readonly agentRuntime: AgentRuntimeService,
    private readonly runsEvents: RunsEvents
  ) {}

  async processRun(runId: string) {
    const run = await this.prisma.run.findUniqueOrThrow({
      where: { id: runId },
      include: { steps: true }
    });

    for (const step of run.steps) {
      if (run.status === "cancelled") {
        return;
      }

      const agent = this.agentRuntime.get(step.agent as never);
      await this.prisma.runStep.update({
        where: { id: step.id },
        data: {
          status: "running",
          startedAt: new Date()
        }
      });
      this.runsEvents.publish({ runId, status: "running", agent: step.agent });

      const response = await this.llmGateway.sendMessage({
        provider: "sber",
        model: "giga-lite",
        systemPrompt: agent.systemPrompt,
        userPrompt: run.prompt,
        jsonMode: true,
        maxTokens: agent.maxOutputTokens,
        temperature: agent.temperature
      });

      await this.prisma.agentExecution.create({
        data: {
          runId,
          stepId: step.id,
          agent: step.agent,
          provider: "sber",
          model: "giga-lite",
          status: "completed",
          promptTokens: response.promptTokens,
          completionTokens: response.completionTokens,
          cachedTokens: response.cachedTokens,
          estimatedCostUsd: response.estimatedCostUsd,
          latencyMs: response.latencyMs,
          errorCode: response.errorCode
        }
      });

      await this.billingService.recordUsage({
        userId: run.userId,
        runId,
        provider: "sber",
        model: "giga-lite",
        promptTokens: response.promptTokens,
        completionTokens: response.completionTokens,
        cachedTokens: response.cachedTokens,
        estimatedCostUsd: response.estimatedCostUsd
      });

      await this.prisma.artifact.create({
        data: {
          runId,
          step: step.agent,
          kind: mapArtifactKind(step.agent),
          title: `${agent.title} output`,
          content: response.content,
          version: 1
        }
      });

      await this.prisma.runStep.update({
        where: { id: step.id },
        data: {
          status: "completed",
          finishedAt: new Date()
        }
      });

      this.logger.log(`Completed ${step.agent} for run ${runId}`);
    }

    await this.prisma.run.update({
      where: { id: runId },
      data: {
        status: "completed",
        summary: "Workflow completed in stub execution mode."
      }
    });

    this.runsEvents.publish({ runId, status: "completed" });
  }
}

function mapArtifactKind(agent: string) {
  if (agent === "developer") {
    return "code";
  }
  if (agent === "tester") {
    return "test-report";
  }
  if (agent === "security-engineer") {
    return "security-report";
  }
  if (agent === "infrastructure-engineer") {
    return "deploy-guide";
  }
  if (agent === "final-synthesizer") {
    return "summary";
  }
  return "plan";
}
