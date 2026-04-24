import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/prisma.service.js";

@Injectable()
export class OrchestratorService {
  constructor(private readonly prisma: PrismaService) {}

  async reserveBudget(runId: string, amount: number) {
    const run = await this.prisma.run.findUniqueOrThrow({ where: { id: runId } });
    if (run.spentTokens + amount > run.hardLimit) {
      throw new Error("Run budget exceeded.");
    }

    return this.prisma.run.update({
      where: { id: runId },
      data: {
        spentTokens: {
          increment: amount
        }
      }
    });
  }
}

