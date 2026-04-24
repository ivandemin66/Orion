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

## Security baseline

- JWT secrets and provider keys must come from managed secrets
- Run API and worker on isolated service accounts
- Restrict egress from the worker to approved provider and MCP endpoints
- Enable dependency and container image scanning in CI

