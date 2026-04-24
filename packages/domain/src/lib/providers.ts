import { z } from "zod";

export const providerSchema = z.object({
  key: z.string(),
  label: z.string(),
  baseUrl: z.string().url(),
  supportsTools: z.boolean(),
  supportsJsonMode: z.boolean(),
  priority: z.number().int().nonnegative()
});

export type ProviderDefinition = z.infer<typeof providerSchema>;

export const defaultProviders: ProviderDefinition[] = [
  {
    key: "yandexgpt",
    label: "YandexGPT",
    baseUrl: "https://llm.api.cloud.yandex.net/foundationModels/v1",
    supportsTools: false,
    supportsJsonMode: true,
    priority: 1
  },
  {
    key: "sber",
    label: "Sber",
    baseUrl: "https://gigachat.devices.sberbank.ru/api/v1",
    supportsTools: true,
    supportsJsonMode: true,
    priority: 2
  },
  {
    key: "selectel",
    label: "Selectel",
    baseUrl: "https://api.selectel.ru/llm/v1",
    supportsTools: true,
    supportsJsonMode: true,
    priority: 3
  },
  {
    key: "openai-compatible",
    label: "OpenAI Compatible",
    baseUrl: "https://api.openai.com/v1",
    supportsTools: true,
    supportsJsonMode: true,
    priority: 4
  }
];

export type UsageSnapshot = {
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  success: boolean;
};

export function normalizeUsage(snapshot: UsageSnapshot) {
  return {
    ...snapshot,
    totalTokens: snapshot.promptTokens + snapshot.completionTokens + snapshot.cachedTokens,
    burnRatePerSecond:
      snapshot.latencyMs === 0
        ? 0
        : Number(((snapshot.promptTokens + snapshot.completionTokens) / (snapshot.latencyMs / 1000)).toFixed(2))
  };
}

