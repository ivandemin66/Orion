# Architecture Notes

## Why this stack

- TypeScript on both sides keeps DTOs, schemas, agent contracts, and UI models aligned.
- NestJS gives module boundaries, guards, DI, and queue-friendly services without forcing microservices.
- Next.js gives a strong SMB-facing interface quickly, with room for SSR, server actions, and dashboard rendering.
- PostgreSQL is the source of truth for runs, steps, executions, billing, sessions, and audit trails.
- Redis is reserved for queues, heartbeats, watchdogs, and future distributed locks.
- S3-compatible storage keeps artifact retention vendor-neutral across RU cloud targets.

## Multi-agent execution model

- The orchestrator runs a fixed SDLC graph, not an emergent agent swarm.
- Every step has explicit budgets, timeouts, allowed tools, and output schemas.
- Handoffs move through versioned artifacts and typed payloads.
- Security findings and budget exhaustion are stop-the-line conditions.

## Open-source orchestration options considered

- BullMQ: good queue, retry, and watchdog base for a modular monolith MVP.
- Temporal: excellent for durable workflows, but too heavy for the first hypothesis check.
- LangGraph: useful for graph-shaped agent flows, but not required before the workflow becomes dynamic.
- OpenTelemetry: best fit for cross-cutting latency, token, and failure tracking.

## MCP integration pattern

- MCP servers are project resources with policy metadata.
- Agents receive explicit allowlists per run.
- Tool calls are audit-logged with duration and status.
- Tool budgets prevent runaway external execution.

