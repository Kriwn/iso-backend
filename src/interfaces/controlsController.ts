import Elysia, { t } from "elysia";
import { CreateControlDto, UpdateControlDto } from "../services/controls/controlsDto";
import { ControlsService } from "../services/controls/controlsService";
import { ControlCodeAlreadyExistsError, ControlCodeIdMismatchError, ControlNotFoundError } from "../errors/controlsError";

import { control_status } from "../../generated/prisma/client";
import { AssessmentControlNotFoundError } from "../errors/assessmentControlError";
import { ControlTypeMismatchError, InvalidControlCodeError } from "../services/controls/iso27001-controls.validator";
import { LLMServiceError } from "../services";

const ControlStatusEnum = {
	NOT_IMPLEMENTED: control_status.NOT_IMPLEMENTED,
	PARTIALLY_IMPLEMENTED: control_status.PARTIALLY,
	IMPLEMENTED: control_status.IMPLEMENTED,
} as const;

type ControlStatus =
	(typeof ControlStatusEnum)[keyof typeof ControlStatusEnum];

export const controlsController = (controlsService: ControlsService) =>
	new Elysia({ prefix: "/api/controls", tags: ["Controls"] })
		.post(
			"/",
			async ({ body, set }) => {
				try {
					const dto: CreateControlDto = {
						name: "",
						guidance: "",
						description: "",
						code: body.code,
						userContext: body.userContext,
						evidenceDescription: body.evidenceDescription,
						currentPractice: body.currentPractice,
						assessmentControlId: body.assessmentControlId,
						status: body.status,
					};
					const control = await controlsService.createControl(dto);
					set.status = 201;
					return control;
				} catch (err) {
					if (err instanceof AssessmentControlNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					if (err instanceof ControlTypeMismatchError) {
						set.status = 409;
						return { message: err.message };
					}
					if (err instanceof InvalidControlCodeError) {
						set.status = 422;
						return { message: err.message };

					}
					if (err instanceof ControlCodeAlreadyExistsError) {
						set.status = 409;
						return { message: err.message };
					}
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: {summary : "Create controls" },
				body: t.Object({
					code: t.String(),
					currentPractice: t.String(),
					userContext: t.Optional(t.String()),
					evidenceDescription: t.Optional(t.String()),
					assessmentControlId: t.Number(),
					status: t.Enum(ControlStatusEnum),
				},
					{ additionalProperties: false }
				)
			}
		)
		.get(
			"/:id",
			async ({ params, set }) => {
				try {
					return await controlsService.getControlById(params.id);
				} catch (err) {
					if (err instanceof ControlNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Get control by ID" },
				params: t.Object({
					id: t.Number(),
				}),
			}
		)
		.get(
			"/",
			async ({ set }) => {
				try {
					return await controlsService.getAllControls();
				} catch (err) {
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Get all controls" },
			}
		)
		.put(
			"/",
			async ({ body, set }) => {
				try {
					return await controlsService.getControlByCodeIso(body.code, body.assessmentControlId);
				} catch (err) {
					if (err instanceof ControlCodeIdMismatchError) {
						set.status = 404;
						return { message: err.message };
					}
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Get control by code and assessmentControlId" },
				body: t.Object({
					code: t.String(),
					assessmentControlId: t.Number(),
				},
					{ additionalProperties: false }
				)
			}
		)
		.put(
			"/suggest/:id",
			async ({ params, set }) => {
				try {
					return await controlsService.suggestControl(params.id);
				} catch (err) {
					if (err instanceof AssessmentControlNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					if (err instanceof LLMServiceError) {
						set.status = 502;
						return { message: err.message };
					}
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "LLM Suggest control by ID" },
				params: t.Object({ id: t.Number() }),
			}
		)
		.patch(
			"/:id",
			async ({ params, body, set }) => {
				try {
					const dto: UpdateControlDto = {
						currentPractice: body.currentPractice,
						assessmentControlId: body.assessmentControlId,
						userContext: body.userContext,
						evidenceDescription: body.evidenceDescription,
						status: body.status,
					};
					return await controlsService.updateControl(params.id, dto);
				} catch (err) {
					if (err instanceof ControlNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Update control by ID" },
				params: t.Object({ id: t.Number() }),
				body: t.Object(
					{
						currentPractice: t.Optional(t.String()),
						userContext: t.Optional(t.String()),
						evidenceDescription: t.Optional(t.String()),
						assessmentControlId: t.Optional(t.Number()),
						status: t.Enum(ControlStatusEnum),
					},
					{ additionalProperties: false }
				),
			}
		)
		.delete(
			"/:id",
			async ({ params, set }) => {
				try {
					await controlsService.deleteControl(params.id);
					set.status = 204;
					return;
				} catch (err) {
					if (err instanceof ControlNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Delete control by ID" },
				params: t.Object({ id: t.Number() }),
			}
		);
