import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/prisma.service.js";
import { CreateMcpServerDto, UpdateMcpServerDto } from "./dto/mcp.dto.js";

@Injectable()
export class McpService {
  constructor(private readonly prisma: PrismaService) {}

  createServer(input: CreateMcpServerDto) {
    return this.prisma.mcpServer.create({
      data: {
        name: input.name,
        transport: input.transport,
        endpoint: input.endpoint,
        isEnabled: input.isEnabled ?? true,
        allowedAgents: input.allowedAgents ?? []
      }
    });
  }

  listServers() {
    return this.prisma.mcpServer.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  updateServer(serverId: string, input: UpdateMcpServerDto) {
    return this.prisma.mcpServer.update({
      where: { id: serverId },
      data: {
        ...(input.isEnabled === undefined ? {} : { isEnabled: input.isEnabled }),
        ...(input.allowedAgents === undefined ? {} : { allowedAgents: input.allowedAgents })
      }
    });
  }
}

