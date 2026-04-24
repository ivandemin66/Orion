import { Module } from "@nestjs/common";
import { AgentRuntimeService } from "./agent-runtime.service.js";

@Module({
  providers: [AgentRuntimeService],
  exports: [AgentRuntimeService]
})
export class AgentRuntimeModule {}

