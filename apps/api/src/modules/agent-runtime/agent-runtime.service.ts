import { Injectable } from "@nestjs/common";
import { defaultAgents, type AgentConfig, type AgentKind } from "@mass/domain";

@Injectable()
export class AgentRuntimeService {
  private readonly agents = new Map(defaultAgents.map((agent) => [agent.kind, agent]));

  getAll() {
    return [...this.agents.values()];
  }

  get(kind: AgentKind): AgentConfig {
    const config = this.agents.get(kind);
    if (!config) {
      throw new Error(`Unknown agent: ${kind}`);
    }

    return config;
  }
}

