import Elysia, { t } from "elysia";
import { CreateControlDto, UpdateControlDto } from "../services/controls/controlsDto";
import { ControlsService } from "../services/controls/controlsService";
import { ControlNotFoundError } from "../errors/controlsError";

import { control_status } from "../../generated/prisma/client";

const ControlStatusEnum = {
  NOT_IMPLEMENTED: control_status.NOT_IMPLEMENTED,
  PARTIALLY_IMPLEMENTED: control_status.PARTIALLY,
  IMPLEMENTED: control_status.IMPLEMENTED,
} as const;

type ControlStatus =
  (typeof ControlStatusEnum)[keyof typeof ControlStatusEnum];

// TODO fix status error
export const ControlsController = (controlsService: ControlsService) =>
	new Elysia({ prefix: "/api/controls", tags: ["Controls"] })
		.post(
			"/",
			async ({ body, set }) => {
				try {
					const dto: CreateControlDto = {
						code: body.code,
						name: body.name,
						currentPractice: body.currentPractice,
						description: body.description,
						assessmentControlId: body.assessmentControlId,
						status: body.status,
					};
					const control = await controlsService.createControl(dto);
					set.status = 201;
					return control;
				} catch (err) {
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{ body: t.Object({
				code: t.String(),
				name: t.String(),
				currentPractice: t.String(),
				description: t.String(),
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
			}
		)
		.patch(
			"/:id",
			async ({ params, body, set }) => {
				try {
					const dto: UpdateControlDto = {
						code: body.code,
						name: body.name,
						currentPractice: body.currentPractice,
						description: body.description,
						assessmentControlId: body.assessmentControlId,
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
				params: t.Object({ id: t.Number() }),
				body: t.Object(
					{
						code: t.Optional(t.String()),
						name: t.Optional(t.String()),
						currentPractice: t.Optional(t.String()),
						description: t.Optional(t.String()),
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
				params: t.Object({ id: t.Number() }),
			}
		);
