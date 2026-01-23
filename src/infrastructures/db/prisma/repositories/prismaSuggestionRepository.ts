import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { SuggestionEntity, toSuggestionEntity } from "../../../../entities/suggestionEntity";
import { SuggestionRepository } from "../../../../repositories/suggestionRepository";
import { CreateSuggestionDto, UpdateSuggestionDto } from "../../../../services/suggestion/suggestionDto";

export class PrismaSuggestionRepository implements SuggestionRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async create(data: CreateSuggestionDto): Promise<SuggestionEntity> {
		try {
			const suggestion = await this.prisma.suggestion.create({data});
			return toSuggestionEntity(suggestion);
		}
		catch (error) {
			throw error;
		}
	}

	async update(id: number, data: UpdateSuggestionDto): Promise<SuggestionEntity> {
		try {
			const suggestion = await this.prisma.suggestion.update({
				where: { id },
				data,
			});
			return toSuggestionEntity(suggestion);
		}
		catch (error) {
			throw new Error("Error updating suggestion: " + error);
		}
	}

	async getByControlId(controlId: number): Promise<SuggestionEntity | null> {
		try {
			const suggestion = await this.prisma.suggestion.findFirst({
				where: { controlId },
			});
			return suggestion ? toSuggestionEntity(suggestion) : null;
		}
		catch (error) {
			throw new Error("Error retrieving suggestion: " + error);
		}
	}

	async delete(id: number): Promise<void> {
		try {
			await this.prisma.suggestion.delete({ where: { id } });
		}
		catch (error) {
			throw new Error("Error deleting suggestion: " + error);
		}
	}
}
