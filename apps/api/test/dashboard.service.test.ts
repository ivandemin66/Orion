import { describe, expect, it } from "vitest";
import { DashboardService } from "../src/modules/dashboard/dashboard.service.js";

describe("DashboardService", () => {
  it("aggregates provider and agent usage", async () => {
    const service = new DashboardService({
      run: {
        findMany: async () => [
          {
            executions: [
              {
                provider: "sber",
                agent: "developer",
                promptTokens: 100,
                completionTokens: 50,
                cachedTokens: 0,
                estimatedCostUsd: 0.5,
                errorCode: null
              },
              {
                provider: "sber",
                agent: "reviewer",
                promptTokens: 25,
                completionTokens: 25,
                cachedTokens: 0,
                estimatedCostUsd: 0.1,
                errorCode: "timeout"
              }
            ],
            steps: []
          }
        ]
      }
    } as never);

    const result = await service.getTokenDashboard("user-1");

    expect(result.totalTokens).toBe(200);
    expect(result.byProvider[0]?.errors).toBe(1);
    expect(result.byAgent).toContainEqual({ agent: "developer", tokens: 150 });
  });
});

