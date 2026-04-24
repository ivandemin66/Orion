import { z } from "zod";

export const runStatusSchema = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled"
]);

export const stepStatusSchema = z.enum([
  "pending",
  "reserved",
  "running",
  "completed",
  "failed",
  "blocked",
  "cancelled"
]);

export const artifactSchema = z.object({
  id: z.string(),
  runId: z.string(),
  step: z.string(),
  kind: z.enum([
    "plan",
    "research",
    "requirements",
    "design",
    "code",
    "test-report",
    "security-report",
    "deploy-guide",
    "summary",
    "archive"
  ]),
  title: z.string(),
  content: z.string(),
  version: z.number().int().positive()
});

export const usageSchema = z.object({
  provider: z.string(),
  model: z.string(),
  promptTokens: z.number().int().nonnegative(),
  completionTokens: z.number().int().nonnegative(),
  cachedTokens: z.number().int().nonnegative().default(0),
  estimatedCostUsd: z.number().nonnegative(),
  latencyMs: z.number().int().nonnegative(),
  errorCode: z.string().nullable()
});

export const agentResultSchema = z.object({
  status: z.enum(["completed", "failed", "needs-human"]),
  summary: z.string(),
  artifacts: z.array(artifactSchema),
  handoffPayload: z.record(z.any()),
  risks: z.array(z.string()),
  assumptions: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  usage: usageSchema,
  needsHuman: z.boolean()
});

export const runInputSchema = z.object({
  prompt: z.string().min(20),
  projectType: z.string().default("web-saas"),
  constraints: z.array(z.string()).default([]),
  providerPolicy: z.enum(["balanced", "ru-first", "cost-saver"]).default("ru-first")
});

export type RunStatus = z.infer<typeof runStatusSchema>;
export type StepStatus = z.infer<typeof stepStatusSchema>;
export type Artifact = z.infer<typeof artifactSchema>;
export type Usage = z.infer<typeof usageSchema>;
export type AgentResult = z.infer<typeof agentResultSchema>;
export type RunInput = z.infer<typeof runInputSchema>;

