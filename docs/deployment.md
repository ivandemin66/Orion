# Deployment Guide

## Local

- Copy `.env.example` to `.env`
- Start infrastructure with `docker compose up -d`
- Install dependencies with `pnpm install`
- Run `pnpm --filter @mass/api prisma generate`
- Run `pnpm --filter @mass/api dev`
- Run `pnpm --filter @mass/web dev`

## Cloud

- Build and push `apps/api` and `apps/web` images
- Apply OpenTofu variables for the target RU cloud
- Install the Helm chart from `infra/helm`
- Provide managed PostgreSQL, Redis, and S3-compatible object storage
- Inject secrets through the target platform secret manager

## Required managed services

### PostgreSQL

Хранит:

- users;
- sessions;
- runs;
- run steps;
- agent executions;
- artifacts;
- token ledger;
- provider credentials metadata;
- MCP servers;
- tool invocation audit.

### Redis

Используется или зарезервирован для:

- queue processing;
- background jobs;
- heartbeat;
- watchdog;
- distributed locks;
- worker coordination.

### S3-compatible object storage

Используется для хранения крупных artifacts, archives и preview results.

В local development эту роль выполняет `MinIO`.

## Secrets management

В production следующие значения должны приходить из `Secret Manager`, `External Secrets` или аналогичного механизма:

- `DATABASE_URL`;
- `REDIS_URL`;
- `JWT_ACCESS_SECRET`;
- `JWT_REFRESH_SECRET`;
- provider API keys;
- OAuth credentials;
- object storage credentials;
- internal service tokens.

Нельзя хранить реальные secrets в:

- `values.yaml`;
- `.env.example`;
- repository files;
- CI logs;
- Docker images.

## Security baseline

Минимальный security baseline:

- хранить JWT secrets и provider keys только в managed secrets;
- использовать отдельные service accounts для `api`, `worker` и infrastructure automation;
- ограничивать egress для worker-процессов только разрешёнными provider и MCP endpoints;
- включить dependency scanning в CI;
- включить container image scanning в CI;
- не запускать containers от root-пользователя, если это возможно;
- использовать минимальные Kubernetes RBAC permissions;
- включить TLS на ingress;
- включить audit logging для MCP tool calls;
- ограничивать tool execution через allowlist и budgets;
- разделять production, staging и local environments.

## Observability

Для production рекомендуется подключить:

- structured logs;
- request tracing;
- `OpenTelemetry`;
- metrics для API latency;
- metrics для token usage;
- metrics для queue latency;
- alerts по failed runs;
- alerts по budget exhaustion;
- alerts по database/Redis availability.

## CI/CD recommendations

Минимальный CI pipeline:

