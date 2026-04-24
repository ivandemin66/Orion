import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard.js";
import { ProvidersService } from "./providers.service.js";

@Controller("providers")
@UseGuards(JwtAuthGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  listProviders() {
    return this.providersService.listProviders();
  }
}

