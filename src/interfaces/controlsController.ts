import Elysia, { t } from "elysia";
import { CreateControlDto, UpdateControlDto } from "../services/Controls/ControlsDto";
import { ControlsService } from "../services/Controls/ControlsService";
import { ControlNotFoundError } from "../errors/ControlsError";

export const ControlsController = (ControlsService: ControlsService) =>
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
					const control = await ControlsService.createControl(dto);
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
				status: t.Union([
					t.Literal("NOT_IMPLEMENTED"),
					t.Literal("PARTIALLY"),
					t.Literal("IMPLEMENTED")
				]),
			},
				{ additionalProperties: false }
		)
			}
		)
		.get(
			"/:id",
			async ({ params, set }) => {
				try {
					return await ControlsService.getControlById(params.id);
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
					return await ControlsService.getAllControls();
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
					return await ControlsService.updateControl(params.id, dto);
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
						status: t.Optional(
							t.Union([
								t.Literal("NOT_IMPLEMENTED"),
								t.Literal("PARTIALLY"),
								t.Literal("IMPLEMENTED")
							])
						),
					},
					{ additionalProperties: false }
				),
			}
		)
		.delete(
			"/:id",
			async ({ params, set }) => {
				try {
					set.status = 200;
					return await ControlsService.deleteControl(params.id);
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
