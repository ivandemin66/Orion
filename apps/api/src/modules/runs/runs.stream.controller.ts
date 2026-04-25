import { Controller, MessageEvent, Param, Sse, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard.js";
import { filter, map, Observable } from "rxjs";
import { RunsEvents } from "./runs.events.js";

@Controller("runs")
@UseGuards(JwtAuthGuard)
export class RunsStreamController {
  constructor(private readonly runsEvents: RunsEvents) {}

  @Sse(":id/stream")
  stream(@Param("id") runId: string): Observable<MessageEvent> {
    return this.runsEvents.stream().pipe(
      filter((event) => event.runId === runId),
      map((event) => ({
        data: event
      }))
    );
  }
}
