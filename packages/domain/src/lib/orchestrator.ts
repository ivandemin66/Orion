import { defaultAgents, type AgentKind } from "./agents";
import { type AgentResult, type RunInput, type RunStatus, type StepStatus } from "./contracts";

export type WorkflowStep = {
  agent: AgentKind;
  status: StepStatus;
  reservedTokens: number;
};

export type WorkflowRun = {
  id: string;
  input: RunInput;
  status: RunStatus;
  steps: WorkflowStep[];
  spentTokens: number;
  softLimit: number;
  hardLimit: number;
  warnings: string[];
};

export const workflowSequence: AgentKind[] = defaultAgents.map((agent) => agent.kind);

export function buildWorkflowRun(id: string, input: RunInput): WorkflowRun {
  const softLimit = 140_000;
  const hardLimit = 180_000;

  return {
    id,
    input,
    status: "queued",
    steps: workflowSequence.map((agent) => ({
      agent,
      status: "pending",
      reservedTokens: reserveTokensForAgent(agent)
    })),
    spentTokens: 0,
    softLimit,
    hardLimit,
    warnings: []
  };
}

export function reserveTokensForAgent(agent: AgentKind): number {
  const map: Record<AgentKind, number> = {
    planner: 6_000,
    researcher: 12_000,
    "business-analyst": 8_000,
    "requirements-engineer": 10_000,
    "system-designer": 10_000,
    architect: 10_000,
    "ux-designer": 8_000,
    developer: 24_000,
    tester: 8_000,
    reviewer: 6_000,
    "security-engineer": 8_000,
    "infrastructure-engineer": 8_000,
    "final-synthesizer": 6_000
  };

  return map[agent];
}

export function applyUsage(run: WorkflowRun, result: AgentResult): WorkflowRun {
  const spent = result.usage.promptTokens + result.usage.completionTokens + result.usage.cachedTokens;
  const nextSpentTokens = run.spentTokens + spent;
  const warnings = [...run.warnings];

  if (nextSpentTokens >= run.softLimit && run.spentTokens < run.softLimit) {
    warnings.push("Soft budget threshold reached.");
  }

  return {
    ...run,
    spentTokens: nextSpentTokens,
    warnings,
    status: nextSpentTokens >= run.hardLimit ? "failed" : run.status
  };
}

export function advanceStep(run: WorkflowRun, agent: AgentKind, status: StepStatus): WorkflowRun {
  const nextSteps = run.steps.map((step) =>
    step.agent === agent ? { ...step, status } : step
  );

  return {
    ...run,
    steps: nextSteps,
    status: status === "running" ? "running" : run.status
  };
}

export function finalizeRun(run: WorkflowRun, resultStatus: Extract<RunStatus, "completed" | "failed" | "cancelled">): WorkflowRun {
  return {
    ...run,
    status: resultStatus
  };
}

export function shouldStopRun(run: WorkflowRun, result: AgentResult): boolean {
  return result.status === "failed" || run.spentTokens >= run.hardLimit || hasCriticalRisk(result.risks);
}

function hasCriticalRisk(risks: string[]): boolean {
  return risks.some((risk) => risk.toLowerCase().includes("critical"));
}
