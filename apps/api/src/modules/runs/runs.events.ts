import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";

type RunEvent = {
  runId: string;
  status: string;
  agent?: string;
};

@Injectable()
export class RunsEvents {
  private readonly events = new Subject<RunEvent>();

  publish(event: RunEvent) {
    this.events.next(event);
  }

  stream() {
    return this.events.asObservable();
  }
}

