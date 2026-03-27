import { describe, expect, mock, test } from "bun:test"
import { OpenAIResponsesLanguageModel } from "@/provider/sdk/copilot/responses/openai-responses-language-model"
import type { LanguageModelV2Prompt } from "@ai-sdk/provider"

const TEST_PROMPT: LanguageModelV2Prompt = [{ role: "user", content: [{ type: "text", text: "Hello" }] }]

function createResponse() {
  return {
    id: "resp_123",
    created_at: 123,
    model: "test-model",
    output: [
      {
        type: "message",
        role: "assistant",
        id: "msg_123",
        content: [
          {
            type: "output_text",
            text: "Hi",
            annotations: [],
          },
        ],
      },
    ],
    service_tier: null,
    incomplete_details: null,
    usage: {
      input_tokens: 10,
      output_tokens: 2,
      total_tokens: 12,
      input_tokens_details: {
        cached_tokens: 8,
      },
      output_tokens_details: {
        reasoning_tokens: 0,
      },
    },
  }
}

function createModel(fetchFn: ReturnType<typeof mock>) {
  return new OpenAIResponsesLanguageModel("test-model", {
    provider: "openai-compatible.responses",
    url: () => "https://api.test.com/responses",
    headers: () => ({ Authorization: "Bearer test-token" }),
    fetch: fetchFn as any,
  })
}

describe("OpenAIResponsesLanguageModel", () => {
  test("should forward prompt_cache_key from provider-specific options", async () => {
    const fetchFn = mock(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.body).toBeDefined()

      const body = JSON.parse(String(init?.body))
      expect(body.prompt_cache_key).toBe("session-123")

      return new Response(JSON.stringify(createResponse()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    })

    const model = createModel(fetchFn)

    const result = await model.doGenerate({
      prompt: TEST_PROMPT,
      providerOptions: {
        "openai-compatible": {
          promptCacheKey: "session-123",
        },
      },
    })

    expect(result.finishReason).toBe("stop")
    expect(result.usage.inputTokens).toBe(10)
    expect(result.content).toEqual([
      {
        type: "text",
        text: "Hi",
        providerMetadata: {
          openai: {
            itemId: "msg_123",
          },
        },
      },
    ])
    expect(fetchFn).toHaveBeenCalledTimes(1)
  })
})
