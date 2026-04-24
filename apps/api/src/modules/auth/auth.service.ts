import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { PrismaService } from "../shared/prisma.service.js";
import { LoginDto, RegisterDto } from "./dto/auth.dto.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(input: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictException("Email already registered.");
    }

    const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash
      }
    });

    return this.issueSession(user.id, user.email);
  }

  async login(input: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const isValid = await argon2.verify(user.passwordHash, input.password);
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    return this.issueSession(user.id, user.email, input.userAgent);
  }

  async refresh(userId: string, email: string) {
    return this.issueTokens(userId, email);
  }

  private async issueSession(userId: string, email: string, userAgent?: string) {
    const tokens = await this.issueTokens(userId, email);
    await this.prisma.session.create({
      data: {
        userId,
        refreshToken: tokens.refreshToken,
        userAgent,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      }
    });

    return tokens;
  }

  private async issueTokens(userId: string, email: string) {
    const payload = { sub: userId, email, role: "user" };
    const accessSecret = this.configService.getOrThrow<string>("JWT_ACCESS_SECRET");
    const refreshSecret = this.configService.getOrThrow<string>("JWT_REFRESH_SECRET");

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: "15m"
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: "30d"
    });

    return {
      accessToken,
      refreshToken
    };
  }
}
