import { describe, expect, it } from "vitest";
import { agentResultSchema, runInputSchema } from "../src/lib/contracts";
import { advanceStep, applyUsage, buildWorkflowRun, shouldStopRun } from "../src/lib/orchestrator";
import { normalizeUsage } from "../src/lib/providers";

describe("workflow orchestrator", () => {
  it("builds the full SDLC chain", () => {
    const input = runInputSchema.parse({
      prompt: "Build an MVP for a RU-first multi-agent code generation platform.",
      constraints: ["RU clouds", "token dashboard"]
    });

    const run = buildWorkflowRun("run-1", input);

    expect(run.steps).toHaveLength(13);
    expect(run.steps[0]?.agent).toBe("planner");
    expect(run.steps[12]?.agent).toBe("final-synthesizer");
  });

  it("tracks token spending and soft-limit warnings", () => {
    const input = runInputSchema.parse({
      prompt: "Build an MVP for a RU-first multi-agent code generation platform."
    });
    const run = buildWorkflowRun("run-2", input);
    const progressed = advanceStep(run, "developer", "running");
    const result = agentResultSchema.parse({
      status: "completed",
      summary: "Code generated.",
      artifacts: [],
      handoffPayload: {},
      risks: [],
      assumptions: [],
      confidence: 0.9,
      needsHuman: false,
      usage: {
        provider: "sber",
        model: "giga-model",
        promptTokens: 120000,
        completionTokens: 30000,
        cachedTokens: 0,
        estimatedCostUsd: 10,
        latencyMs: 2000,
        errorCode: null
      }
    });

    const updated = applyUsage(progressed, result);

    expect(updated.warnings).toContain("Soft budget threshold reached.");
    expect(updated.status).toBe("running");
  });

  it("stops on critical security risks", () => {
    const input = runInputSchema.parse({
      prompt: "Build an MVP for a RU-first multi-agent code generation platform."
    });
    const run = buildWorkflowRun("run-3", input);
    const result = agentResultSchema.parse({
      status: "completed",
      summary: "Security found a blocker.",
      artifacts: [],
      handoffPayload: {},
      risks: ["Critical secret exposure risk"],
      assumptions: [],
      confidence: 0.85,
      needsHuman: false,
      usage: {
        provider: "yandexgpt",
        model: "yandexgpt",
        promptTokens: 200,
        completionTokens: 100,
        cachedTokens: 0,
        estimatedCostUsd: 0.1,
        latencyMs: 500,
        errorCode: null
      }
    });

    expect(shouldStopRun(run, result)).toBe(true);
  });

  it("normalizes usage snapshots", () => {
    const normalized = normalizeUsage({
      provider: "selectel",
      model: "ru-model",
      promptTokens: 500,
      completionTokens: 250,
      cachedTokens: 50,
      estimatedCostUsd: 0.2,
      latencyMs: 1000,
      success: true
    });

    expect(normalized.totalTokens).toBe(800);
    expect(normalized.burnRatePerSecond).toBe(750);
  });
});

