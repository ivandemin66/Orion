import { Injectable, NotFoundException } from "@nestjs/common";
import { buildWorkflowRun, defaultAgents, type AgentConfig, runInputSchema } from "@mass/domain";
import { PrismaService } from "../shared/prisma.service.js";
import type { CreateRunDto } from "./dto/run.dto.js";
import { RunsWorker } from "./runs.worker.js";
import { RunsEvents } from "./runs.events.js";

@Injectable()
export class RunsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly runsWorker: RunsWorker,
    private readonly runsEvents: RunsEvents
  ) {}

  getAgentRegistry(): AgentConfig[] {
    return defaultAgents;
  }

  async createRun(userId: string, input: CreateRunDto) {
    const parsed = runInputSchema.parse(input);
    const workflow = buildWorkflowRun(crypto.randomUUID(), parsed);

    const run = await this.prisma.run.create({
      data: {
        id: workflow.id,
        userId,
        prompt: parsed.prompt,
        projectType: parsed.projectType,
        providerPolicy: parsed.providerPolicy,
        status: workflow.status,
        softLimit: workflow.softLimit,
        hardLimit: workflow.hardLimit,
        steps: {
          create: workflow.steps.map((step) => ({
            agent: step.agent,
            status: step.status,
            reservedTokens: step.reservedTokens
          }))
        }
      },
      include: {
        steps: true
      }
    });

    const response = {
      runId: run.id,
      queuedAt: run.createdAt
    };

    this.runsEvents.publish({ runId: run.id, status: "queued" });
    void this.runsWorker.processRun(run.id);

    return response;
  }

  async listRuns(userId: string) {
    return this.prisma.run.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        steps: true,
        artifacts: true
      }
    });
  }

  async getRun(userId: string, runId: string) {
    const run = await this.prisma.run.findFirst({
      where: { id: runId, userId },
      include: {
        steps: true,
        artifacts: true,
        executions: true
      }
    });

    if (!run) {
      throw new NotFoundException("Run not found.");
    }

    const tokenUsage = run.executions.reduce(
      (accumulator, execution) => {
        accumulator.promptTokens += execution.promptTokens;
        accumulator.completionTokens += execution.completionTokens;
        accumulator.cachedTokens += execution.cachedTokens;
        accumulator.estimatedCostUsd += execution.estimatedCostUsd;
        return accumulator;
      },
      {
        promptTokens: 0,
        completionTokens: 0,
        cachedTokens: 0,
        estimatedCostUsd: 0
      }
    );

    return {
      ...run,
      currentStep: run.steps.find((step) => step.status === "running")?.agent ?? null,
      tokenUsage
    };
  }

  async getRunSteps(userId: string, runId: string) {
    const run = await this.getRun(userId, runId);
    return run.steps;
  }

  async getArtifacts(userId: string, runId: string) {
    const run = await this.getRun(userId, runId);
    return run.artifacts;
  }

  async cancelRun(userId: string, runId: string) {
    await this.getRun(userId, runId);
    return this.prisma.run.update({
      where: { id: runId },
      data: {
        status: "cancelled",
        steps: {
          updateMany: {
            where: {
              status: {
                in: ["pending", "reserved", "running"]
              }
            },
            data: {
              status: "cancelled"
            }
          }
        }
      }
    });
  }
}
