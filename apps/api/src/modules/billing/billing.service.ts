import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/prisma.service.js";

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async recordUsage(input: {
    userId: string;
    runId: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    cachedTokens: number;
    estimatedCostUsd: number;
  }) {
    const totalTokens = input.promptTokens + input.completionTokens + input.cachedTokens;

    await this.prisma.$transaction([
      this.prisma.tokenLedgerEntry.create({
        data: {
          userId: input.userId,
          runId: input.runId,
          direction: "debit",
          amount: totalTokens,
          promptTokens: input.promptTokens,
          completionTokens: input.completionTokens,
          cachedTokens: input.cachedTokens,
          estimatedCostUsd: input.estimatedCostUsd,
          provider: input.provider,
          model: input.model
        }
      }),
      this.prisma.user.update({
        where: { id: input.userId },
        data: {
          tokenBalance: {
            decrement: totalTokens
          }
        }
      }),
      this.prisma.run.update({
        where: { id: input.runId },
        data: {
          spentTokens: {
            increment: totalTokens
          }
        }
      })
    ]);
  }

  getLedger(userId: string) {
    return this.prisma.tokenLedgerEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }
}

