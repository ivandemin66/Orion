import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard.js";
import { PrismaService } from "../shared/prisma.service.js";

@Controller("provider-credentials")
@UseGuards(JwtAuthGuard)
export class ProviderCredentialsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.providerCredential.findMany({
      select: {
        id: true,
        providerKey: true,
        label: true,
        baseUrl: true,
        isEnabled: true,
        createdAt: true
      }
    });
  }

  @Post()
  create(@Body() input: { providerKey: string; label: string; baseUrl: string; apiKey: string }) {
    return this.prisma.providerCredential.create({
      data: input
    });
  }
}

