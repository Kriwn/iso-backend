export interface LlmSuggestRequest {
  controlCode: string;
  title: string;
  description: string;
  guidance: string;
	userContext?: string | null;
	evidenceDescription?: string | null;
  status: string;
  currentPractice: string;
}
