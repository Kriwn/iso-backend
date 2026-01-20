import { Suggestion } from "../../generated/prisma/client";

export interface SuggestionEntity {
	id: number;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	controlId: number;
}

export function toSuggestionEntity(data: Suggestion): SuggestionEntity {
	return {
		id: data.id,
		content: data.content,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
		controlId: data.controlId,
	};
}
