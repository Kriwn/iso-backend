import { Env } from "../../config/env";
import { LlmSuggestRequest } from "./llmDto";

export class LLMServiceError extends Error {
  constructor(id: number) {
    super(`LLM Service failed for control ID: ${id}`);
    this.name = "LLMServiceError";
  }
}

export class LlmService {
  constructor(private env: Env) {}

  async suggestWithLlm(
    payload: LlmSuggestRequest
  ): Promise<any> {
  const res = await fetch(this.env.POST_LLM_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.env.LLM_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return data;
}

}
