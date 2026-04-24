import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt.guard.js";
import { BillingService } from "./billing.service.js";

@Controller("billing")
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get("ledger")
  ledger(@Req() request: Request & { user: { sub: string } }) {
    return this.billingService.getLedger(request.user.sub);
  }
}

