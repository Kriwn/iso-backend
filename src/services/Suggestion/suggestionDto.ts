export interface CreateSuggestionDto {
	content: string;
	controlId: number;
}

export interface UpdateSuggestionDto {
	content?: string;
}
