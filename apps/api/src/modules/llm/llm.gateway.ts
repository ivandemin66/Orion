import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { defaultProviders, normalizeUsage } from "@mass/domain";
import type { LlmRequest, LlmResponse, ProviderCapabilities } from "./llm.types.js";

type GigaChatOauthResponse = {
  access_token: string;
  expires_at: number;
};

type GigaChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

@Injectable()
export class LlmGateway {
  private cachedGigaChatToken: { token: string; expiresAtMs: number } | null = null;

  constructor(private readonly configService: ConfigService) {}

  getProviderCapabilities(providerKey: string): ProviderCapabilities {
    const provider = defaultProviders.find((item) => item.key === providerKey);
    return {
      supportsTools: provider?.supportsTools ?? false,
      supportsJsonMode: provider?.supportsJsonMode ?? false
    };
  }

  async sendMessage(input: LlmRequest): Promise<LlmResponse> {
    if (input.provider === "sber") {
      return this.sendGigaChatMessage(input);
    }

    return this.sendStubMessage(input);
  }

  private async sendStubMessage(input: LlmRequest): Promise<LlmResponse> {
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

  private async sendGigaChatMessage(input: LlmRequest): Promise<LlmResponse> {
    const startedAt = Date.now();
    const apiBaseUrl = this.configService.get<string>("SBER_API_URL") ?? "https://gigachat.devices.sberbank.ru/api/v1";
    const model = this.mapModelName(input.model);

    try {
      const accessToken = await this.getGigaChatAccessToken();
      const response = await fetch(`${apiBaseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          model,
          temperature: input.temperature,
          max_tokens: input.maxTokens,
          messages: [
            { role: "system", content: input.systemPrompt },
            { role: "user", content: input.userPrompt }
          ]
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`GigaChat completion failed: ${response.status} ${errorBody}`);
      }

      const data = (await response.json()) as GigaChatCompletionResponse;
      const content = data.choices?.[0]?.message?.content ?? "";
      const promptTokens = data.usage?.prompt_tokens ?? this.countTokens(input.systemPrompt) + this.countTokens(input.userPrompt);
      const completionTokens = data.usage?.completion_tokens ?? this.countTokens(content);
      const totalTokens = data.usage?.total_tokens ?? promptTokens + completionTokens;
      const cachedTokens = Math.max(0, totalTokens - promptTokens - completionTokens);
      const latencyMs = Date.now() - startedAt;

      return {
        content,
        promptTokens,
        completionTokens,
        cachedTokens,
        estimatedCostUsd: 0,
        latencyMs,
        errorCode: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown GigaChat error.";
      return {
        content: JSON.stringify({
          status: "failed",
          summary: "Ошибка вызова GigaChat API.",
          details: errorMessage
        }),
        promptTokens: 0,
        completionTokens: 0,
        cachedTokens: 0,
        estimatedCostUsd: 0,
        latencyMs: Date.now() - startedAt,
        errorCode: "GIGACHAT_REQUEST_FAILED"
      };
    }
  }

  private async getGigaChatAccessToken(): Promise<string> {
    if (this.cachedGigaChatToken && this.cachedGigaChatToken.expiresAtMs > Date.now() + 10_000) {
      return this.cachedGigaChatToken.token;
    }

    const authKey = this.configService.get<string>("SBER_AUTH_KEY") ?? this.configService.get<string>("SBER_API_KEY");
    if (!authKey) {
      throw new Error("SBER_AUTH_KEY is not configured.");
    }

    const oauthUrl = this.configService.get<string>("SBER_OAUTH_URL") ?? "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
    const scope = this.configService.get<string>("SBER_SCOPE") ?? "GIGACHAT_API_PERS";
    const rqUid = crypto.randomUUID();
    const body = new URLSearchParams({ scope });

    const response = await fetch(oauthUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        RqUID: rqUid,
        Authorization: `Basic ${authKey}`
      },
      body
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`GigaChat OAuth failed: ${response.status} ${errorBody}`);
    }

    const data = (await response.json()) as GigaChatOauthResponse;
    if (!data.access_token) {
      throw new Error("GigaChat OAuth response does not contain access_token.");
    }

    // Токен живет 30 минут, поэтому дополнительно сокращаем TTL на 60 секунд для безопасного обновления.
    this.cachedGigaChatToken = {
      token: data.access_token,
      expiresAtMs: (data.expires_at || Date.now() + 30 * 60 * 1000) - 60_000
    };

    return data.access_token;
  }

  private mapModelName(inputModel: string): string {
    if (inputModel === "giga-lite") {
      return "GigaChat-Lite";
    }
    return inputModel;
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

