import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard.js";
import { CreateMcpServerDto, UpdateMcpServerDto } from "./dto/mcp.dto.js";
import { McpService } from "./mcp.service.js";

@Controller("mcp/servers")
@UseGuards(JwtAuthGuard)
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  @Post()
  create(@Body() input: CreateMcpServerDto) {
    return this.mcpService.createServer(input);
  }

  @Get()
  list() {
    return this.mcpService.listServers();
  }

  @Patch(":id")
  update(@Param("id") serverId: string, @Body() input: UpdateMcpServerDto) {
    return this.mcpService.updateServer(serverId, input);
  }
}

