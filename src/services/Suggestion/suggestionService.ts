import { SuggestionRepository } from "../../repositories/suggestionRepository";
import { CreateSuggestionDto, UpdateSuggestionDto } from "./suggestionDto";

export class SuggestionService {
	constructor(private suggestionRepository: SuggestionRepository) {}

	async createSuggestion(data: CreateSuggestionDto) {
		return this.suggestionRepository.create(data);
	}

	async updateSuggestion(id: number, data: UpdateSuggestionDto) {
		return this.suggestionRepository.update(id, data);
	}

	async deleteSuggestion(id: number) {
		return this.suggestionRepository.delete(id);
	}

	async getSuggestionByControlId(controlId: number) {
		return this.suggestionRepository.getByControlId(controlId);
	}

	async getAllSuggestions() {
		return this.suggestionRepository.getAll();
	}
}
