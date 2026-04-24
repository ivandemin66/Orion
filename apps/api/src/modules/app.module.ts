import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AgentRuntimeModule } from "./agent-runtime/agent-runtime.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { BillingModule } from "./billing/billing.module.js";
import { DashboardModule } from "./dashboard/dashboard.module.js";
import { LlmModule } from "./llm/llm.module.js";
import { McpModule } from "./mcp/mcp.module.js";
import { ProvidersModule } from "./providers/providers.module.js";
import { RunsModule } from "./runs/runs.module.js";
import { PrismaModule } from "./shared/prisma.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AgentRuntimeModule,
    AuthModule,
    BillingModule,
    LlmModule,
    RunsModule,
    DashboardModule,
    ProvidersModule,
    McpModule
  ]
})
export class AppModule {}
