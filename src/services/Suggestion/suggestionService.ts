import { SuggestionRepository } from "../../repositories/suggestionRepository";
import { createSuggestionDto, updateSuggestionDto } from "./suggestionDto";

export class SuggestionService {
	constructor(private suggestionRepository: SuggestionRepository) {}

	async createSuggestion(data: createSuggestionDto) {
		return this.suggestionRepository.create(data);
	}

	async updateSuggestion(id: number, data: updateSuggestionDto) {
		return this.suggestionRepository.update(id, data);
	}

	async deleteSuggestion(id: number) {
		return this.suggestionRepository.delete(id);
	}

	async getSuggestionByControlId(controlId: number) {
		return this.suggestionRepository.getByControlId(controlId);
	}
}
