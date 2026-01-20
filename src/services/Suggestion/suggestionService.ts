import { SuggestionRepository } from "../../repositories/suggestionRepository";
import { createSuggestionDto, updateSuggestionDto } from "./SuggestionDto";

export class SuggestionService {
	constructor(private suggestionRepository: SuggestionRepository) {}

	async createSuggestion(data: createSuggestionDto) {
		return this.suggestionRepository.create(data);
	}

	async updateSuggestion(id: string, data: updateSuggestionDto) {
		return this.suggestionRepository.update(id, data);
	}

	async deleteSuggestion(id: string) {
		return this.suggestionRepository.delete(id);
	}

	async getSuggestionByControlId(controlId: string) {
		return this.suggestionRepository.getByControlId(controlId);
	}
}
