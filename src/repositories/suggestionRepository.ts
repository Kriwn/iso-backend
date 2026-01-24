import { SuggestionEntity } from "../entities/suggestionEntity";
import { CreateSuggestionDto, UpdateSuggestionDto } from "../services/suggestion/suggestionDto";

export interface SuggestionRepository {
	create(data: CreateSuggestionDto) : Promise<SuggestionEntity>;
	update(id: number, data: UpdateSuggestionDto) : Promise<SuggestionEntity>;
	delete(id: number) : Promise<void>;
	getByControlId(controlId: number) : Promise<SuggestionEntity | null>;
	getAll() : Promise<SuggestionEntity[]>;
}
