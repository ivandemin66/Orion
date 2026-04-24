import { buildWorkflowRun, runInputSchema } from "@mass/domain";

export const demoRun = buildWorkflowRun(
  "demo-run",
  runInputSchema.parse({
    prompt:
      "Build a RU-first multi-agent code generation service with auth, orchestration, MCP, token tracking, and cloud-ready deployment."
  })
);

export const demoDashboard = {
  totalTokens: 38240,
  totalCost: 17.4,
  byProvider: [
    { provider: "sber", totalTokens: 20100, estimatedCostUsd: 8.3, errors: 0 },
    { provider: "yandexgpt", totalTokens: 12140, estimatedCostUsd: 5.1, errors: 1 },
    { provider: "selectel", totalTokens: 6000, estimatedCostUsd: 4, errors: 0 }
  ],
  byAgent: [
    { agent: "planner", tokens: 1200 },
    { agent: "researcher", tokens: 3600 },
    { agent: "developer", tokens: 18000 },
    { agent: "tester", tokens: 4600 },
    { agent: "security-engineer", tokens: 2200 }
  ],
  burnRateDaily: 38240,
  burnRateWeekly: 267680
};

