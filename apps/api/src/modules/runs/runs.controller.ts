import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt.guard.js";
import { CreateRunDto } from "./dto/run.dto.js";
import { RunsService } from "./runs.service.js";

type AuthenticatedRequest = Request & { user: { sub: string } };

@Controller()
@UseGuards(JwtAuthGuard)
export class RunsController {
  constructor(private readonly runsService: RunsService) {}

  @Get("me/runs")
  listRuns(@Req() request: AuthenticatedRequest) {
    return this.runsService.listRuns(request.user.sub);
  }

  @Post("runs")
  createRun(@Req() request: AuthenticatedRequest, @Body() input: CreateRunDto) {
    return this.runsService.createRun(request.user.sub, input);
  }

  @Get("runs/:id")
  getRun(@Req() request: AuthenticatedRequest, @Param("id") runId: string) {
    return this.runsService.getRun(request.user.sub, runId);
  }

  @Get("runs/:id/steps")
  getSteps(@Req() request: AuthenticatedRequest, @Param("id") runId: string) {
    return this.runsService.getRunSteps(request.user.sub, runId);
  }

  @Get("runs/:id/artifacts")
  getArtifacts(@Req() request: AuthenticatedRequest, @Param("id") runId: string) {
    return this.runsService.getArtifacts(request.user.sub, runId);
  }

  @Post("runs/:id/cancel")
  cancelRun(@Req() request: AuthenticatedRequest, @Param("id") runId: string) {
    return this.runsService.cancelRun(request.user.sub, runId);
  }
}

