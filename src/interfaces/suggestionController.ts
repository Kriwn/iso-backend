import Elysia, { t } from "elysia";
import { CreateSuggestionDto, UpdateSuggestionDto } from "../services/suggestion/suggestionDto";
import { SuggestionService } from "../services/suggestion/suggestionService";

export const suggestionController = (suggestionService: SuggestionService) =>
	new Elysia({ prefix: "/api/suggestions", tags: ["Suggestions"] })
		.post(
			"/",
			async ({ body, set }) => {
				try {
					const dto: CreateSuggestionDto = {
						content: body.content,
						controlId: body.controlId,
					};
					const suggestion = await suggestionService.createSuggestion(dto);
					set.status = 201;
					return suggestion;
				} catch (error) {
					set.status = 500;
					return { error: "Failed to create suggestion" };
				}
			},
			{
				detail: { summary: "Create suggestion" },
				body: t.Object(
					{
						content: t.String(),
						controlId: t.Number(),
					},
					{ additionalProperties: false }
				),
			}
		)
		.get(
			"/control/:controlId",
			async ({ params, set }) => {
				try {
					const suggestion = await suggestionService.getSuggestionByControlId(
						params.controlId
					);
					if (suggestion) {
						set.status = 200;
						return suggestion;
					} else {
						set.status = 404;
						return { error: "Suggestion not found" };
					}
				} catch (error) {
					set.status = 500;
					return { error: "Failed to retrieve suggestion" };
				}
			},
			{
				detail: { summary: "Get suggestion by Control ID" },
				params: t.Object({
					controlId: t.Number(),
				}),
			}
		)
		.patch(
			"/:id",
			async ({ params, body, set }) => {
				try {
					const dto: UpdateSuggestionDto = {
						content: body.content,
					};
					const suggestion = await suggestionService.updateSuggestion(
						params.id,
						dto
					);
					set.status = 200;
					return suggestion;
				} catch (error) {
					set.status = 500;
					return { error: "Failed to update suggestion" };
				}
			},
			{
				detail: { summary: "Update suggestion" },
				params: t.Object({
					id: t.Number(),
				}),
				body: t.Object(
					{
						content: t.String(),
					},
					{ additionalProperties: false }
				),
			}
		)
		.delete(
			"/:id",
			async ({ params, set }) => {
				try {
					await suggestionService.deleteSuggestion(params.id);
					set.status = 204;
					return;
				} catch (error) {
					set.status = 500;
					return { error: "Failed to delete suggestion" };
				}
			},
			{
				detail: { summary: "Delete suggestion" },
				params: t.Object({
					id: t.Number(),
				}),
			}
		);
