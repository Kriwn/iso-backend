import { SuggestionEntity } from "../entities/suggestionEntity";
import { createSuggestionDto, updateSuggestionDto } from "../services/Suggestion/suggestionDto";

export interface SuggestionRepository {
	create(data: createSuggestionDto) : Promise<SuggestionEntity>;
	update(id: number, data: updateSuggestionDto) : Promise<SuggestionEntity>;
	delete(id: number) : Promise<void>;
	getByControlId(controlId: number) : Promise<SuggestionEntity | null>;
}
