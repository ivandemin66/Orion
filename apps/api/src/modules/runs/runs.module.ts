import { Module } from "@nestjs/common";
import { AgentRuntimeModule } from "../agent-runtime/agent-runtime.module.js";
import { BillingModule } from "../billing/billing.module.js";
import { LlmModule } from "../llm/llm.module.js";
import { RunsController } from "./runs.controller.js";
import { RunsEvents } from "./runs.events.js";
import { RunsService } from "./runs.service.js";
import { RunsStreamController } from "./runs.stream.controller.js";
import { RunsWorker } from "./runs.worker.js";
import { OrchestratorService } from "./orchestrator.service.js";

@Module({
  imports: [LlmModule, AgentRuntimeModule, BillingModule],
  controllers: [RunsController, RunsStreamController],
  providers: [RunsService, OrchestratorService, RunsWorker, RunsEvents],
  exports: [RunsService, OrchestratorService]
})
export class RunsModule {}
