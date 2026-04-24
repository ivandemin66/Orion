import { Module } from "@nestjs/common";
import { LlmGateway } from "./llm.gateway.js";

@Module({
  providers: [LlmGateway],
  exports: [LlmGateway]
})
export class LlmModule {}

