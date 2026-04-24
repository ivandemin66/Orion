import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/prisma.service.js";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getTokenDashboard(userId: string) {
    const runs = await this.prisma.run.findMany({
      where: { userId },
      include: {
        executions: true,
        steps: true
      }
    });

    const byProvider = new Map<string, { provider: string; totalTokens: number; estimatedCostUsd: number; errors: number }>();
    const byAgent = new Map<string, number>();
    let totalTokens = 0;
    let totalCost = 0;

    for (const run of runs) {
      for (const execution of run.executions) {
        const executionTokens = execution.promptTokens + execution.completionTokens + execution.cachedTokens;
        totalTokens += executionTokens;
        totalCost += execution.estimatedCostUsd;

        const provider = byProvider.get(execution.provider) ?? {
          provider: execution.provider,
          totalTokens: 0,
          estimatedCostUsd: 0,
          errors: 0
        };

        provider.totalTokens += executionTokens;
        provider.estimatedCostUsd += execution.estimatedCostUsd;
        provider.errors += execution.errorCode ? 1 : 0;
        byProvider.set(execution.provider, provider);

        byAgent.set(execution.agent, (byAgent.get(execution.agent) ?? 0) + executionTokens);
      }
    }

    return {
      totalTokens,
      totalCost,
      byProvider: [...byProvider.values()],
      byAgent: [...byAgent.entries()].map(([agent, tokens]) => ({ agent, tokens })),
      burnRateDaily: totalTokens,
      burnRateWeekly: totalTokens * 7
    };
  }
}

