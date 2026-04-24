import { Injectable } from "@nestjs/common";
import { defaultProviders, normalizeUsage } from "@mass/domain";
import type { LlmRequest, LlmResponse, ProviderCapabilities } from "./llm.types.js";

@Injectable()
export class LlmGateway {
  getProviderCapabilities(providerKey: string): ProviderCapabilities {
    const provider = defaultProviders.find((item) => item.key === providerKey);
    return {
      supportsTools: provider?.supportsTools ?? false,
      supportsJsonMode: provider?.supportsJsonMode ?? false
    };
  }

  async sendMessage(input: LlmRequest): Promise<LlmResponse> {
    const startedAt = Date.now();
    const promptTokens = this.countTokens(input.systemPrompt) + this.countTokens(input.userPrompt);
    const completionTokens = Math.max(120, Math.round(promptTokens * 0.18));
    const latencyMs = Date.now() - startedAt + 250;
    const estimatedCostUsd = Number(((promptTokens + completionTokens) * 0.00001).toFixed(4));

    return {
      content: JSON.stringify({
        status: "completed",
        summary: `${input.model} completed the task in stub mode.`,
        risks: [],
        assumptions: ["Live provider integration should replace the stub gateway."],
        confidence: 0.76
      }),
      promptTokens,
      completionTokens,
      cachedTokens: 0,
      estimatedCostUsd,
      latencyMs,
      errorCode: null
    };
  }

  async streamMessage(input: LlmRequest) {
    const response = await this.sendMessage(input);
    return [response.content];
  }

  countTokens(content: string) {
    return Math.ceil(content.length / 4);
  }

  mapUsage(response: LlmResponse, provider: string, model: string) {
    return normalizeUsage({
      provider,
      model,
      promptTokens: response.promptTokens,
      completionTokens: response.completionTokens,
      cachedTokens: response.cachedTokens,
      estimatedCostUsd: response.estimatedCostUsd,
      latencyMs: response.latencyMs,
      success: response.errorCode === null
    });
  }
}

