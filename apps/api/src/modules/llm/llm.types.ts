export type LlmRequest = {
  provider: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
  maxTokens: number;
  temperature: number;
};

export type LlmResponse = {
  content: string;
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  errorCode: string | null;
};

export type ProviderCapabilities = {
  supportsTools: boolean;
  supportsJsonMode: boolean;
};

