import { Module } from "@nestjs/common";
import { ProviderCredentialsController } from "./provider-credentials.controller.js";
import { ProvidersController } from "./providers.controller.js";
import { ProvidersService } from "./providers.service.js";

@Module({
  controllers: [ProvidersController, ProviderCredentialsController],
  providers: [ProvidersService]
})
export class ProvidersModule {}

