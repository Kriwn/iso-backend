import { Env } from "../../config/env";
import { LlmSuggestRequest, LlmSuggestResponse } from "./llmDto";

export class LlmService {
  constructor(private env: Env) {}

  async suggestWithLlm(
    payload: LlmSuggestRequest
  ): Promise<LlmSuggestResponse> {
  console.log("this.env.POST_LLM_PATH:", this.env.POST_LLM_PATH);
  console.log("this.env.POST_LLM_KEY:", this.env.LLM_API_KEY);
  console.log("Payload sent to LLM Service:", payload);
  const res = await fetch(this.env.POST_LLM_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.env.LLM_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM service error: ${res.status} - ${text}`);
  }

  return res.json();
}

}
