export interface LlmSuggestRequest {
  controlCode: string;
  title: string;
  description: string;
  guidance: string;
  status: string;
  currentPractice: string;
}

export interface LlmSuggestResponse {
  suggestion: string;
}
