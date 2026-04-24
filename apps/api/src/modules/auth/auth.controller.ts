import { Body, Controller, Get, Headers, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt.guard.js";
import { AuthService } from "./auth.service.js";
import { LoginDto, RegisterDto } from "./dto/auth.dto.js";
import type { Request } from "express";
import { PrismaService } from "../shared/prisma.service.js";

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Post("auth/register")
  register(@Body() input: RegisterDto) {
    return this.authService.register(input);
  }

  @Post("auth/login")
  login(@Body() input: LoginDto, @Headers("user-agent") userAgent?: string) {
    return this.authService.login({ ...input, userAgent });
  }

  @Post("auth/refresh")
  refresh(@Body() body: { userId: string; email: string }) {
    return this.authService.refresh(body.userId, body.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() request: Request & { user: { sub: string; email: string; role: string } }) {
    return {
      id: request.user.sub,
      email: request.user.email,
      role: request.user.role
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me/balance")
  async balance(@Req() request: Request & { user: { sub: string } }) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: request.user.sub },
      select: { tokenBalance: true }
    });

    return user;
  }
}
