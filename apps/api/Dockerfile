FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/domain/package.json packages/domain/package.json
RUN pnpm install --filter @mass/api... --frozen-lockfile=false

FROM deps AS build
COPY . .
RUN pnpm --filter @mass/api prisma generate
RUN pnpm --filter @mass/api build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=build /app ./
CMD ["pnpm", "--filter", "@mass/api", "start"]

