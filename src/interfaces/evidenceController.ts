import Elysia, { t } from "elysia";
import { EvidenceAlreadyExistsError, EvidenceNotFoundError } from "../errors/evidenceError";
import { createEvidenceDto } from "../services/evidence/evidenceDto";
import { EvidenceService } from "../services/evidence/evidenceService";

export const evidenceController = (EvidenceService: EvidenceService) =>
	new Elysia({ prefix: "/api/evidence", tags: ["Evidence"] })
		.post(
			"/",
			async ({body, set}) => {
				try {
					const dto: createEvidenceDto = {
						fileName: body.fileName,
						filePath: body.filePath,
						controlId: body.controlId,
					};
					const evidence = await EvidenceService.createEvidence(dto);
					set.status = 201;
					return evidence;
				} catch (error) {
					if (error instanceof EvidenceAlreadyExistsError) {
						set.status = 409;
						return { error: error.message };
					}
					set.status = 500;
					return { error: "Failed to create evidence" };
				}
			},
			{
				detail: { summary: "Create evidence" },
				body: t.Object({
					fileName: t.String(),
					filePath: t.String(),
					controlId: t.Number(),
				},
				{ additionalProperties: false }
			)
			}
		)
		.get(
			"/:id",
			async ({params, set}) => {
				try {
					const evidence = await EvidenceService.getEvidenceById(params.id);
					set.status = 200;
					return evidence;
				} catch (error) {
					if (error instanceof EvidenceNotFoundError) {
						set.status = 404;
						return { error: error.message };
					}
					set.status = 500;
					return { error: "Failed to retrieve evidence" };
				}
			},
			{
				detail: { summary: "Get evidence by ID" },
				params: t.Object({
					id: t.Number(),
				})
			}
		)
		.get(
			"/",
			async ({set}) => {
				try {
					const evidenceList = await EvidenceService.getAllEvidence();
					set.status = 200;
					return evidenceList;
				} catch (error) {
					set.status = 500;
					return { error: "Failed to retrieve evidence list" };
				}
			},
			{
				detail: { summary: "Get all evidence" }
			}
		)
		.get(
			"getAllByControlId/:controlId",
			async ({params, set}) => {
				try {
					const evidenceList = await EvidenceService.getAllEvidenceByControlId(params.controlId);
					set.status = 200;
					return evidenceList;
				} catch (error) {
					set.status = 500;
					return { error: "Failed to retrieve evidence list by control ID" };
				}
			},
			{
				detail: { summary: "Get all evidence by Control ID" },
				params: t.Object({
					controlId: t.Number(),
				})
			}
		)
		.patch(
			"/:id",
			async ({params, body, set}) => {
				try {
					const evidence = await EvidenceService.updateEvidence(params.id, body);
					set.status = 200;
					return evidence;
				} catch (error) {
					if (error instanceof EvidenceNotFoundError) {
						set.status = 404;
						return { error: error.message };
					}
					if (error instanceof EvidenceAlreadyExistsError) {
						set.status = 409;
						return { error: error.message };
					}
					set.status = 500;
					return { error: "Failed to update evidence" };
				}
			},
			{
				detail: { summary: "Update evidence by ID" },
				params: t.Object({
					id: t.Number(),
				}),
				body: t.Object({
					fileName: t.Optional(t.String()),
					filePath: t.Optional(t.String()),
					controlId: t.Optional(t.Number()),
				},
				{ additionalProperties: false }
			)
			}
		)
		.delete(
			"/:id",
			async ({params, set}) => {
				try {
					await EvidenceService.deleteEvidence(params.id);
					set.status = 204;
					return;
				} catch (error) {
					if (error instanceof EvidenceNotFoundError) {
						set.status = 404;
						return { error: error.message };
					}
					set.status = 500;
					return { error: "Failed to delete evidence" };
				}
			},
			{
				detail: { summary: "Delete evidence by ID" },
				params: t.Object({
					id: t.Number(),
				})
			}
		);
