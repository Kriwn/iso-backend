import Elysia, { t } from "elysia";
import { AssessmentControlService } from "../services/AssessmentControl/AssessmentControlService";
import { CreateAssessmentControlDto, UpdateAssessmentControlDto } from "../services/AssessmentControl/AssessmentControlDto";
import { AssessmentControlNotFoundError } from "../errors/AssessmentControlError";

export const AssessmentControlController= (assessmentControlService: AssessmentControlService) =>
	new Elysia({ prefix: "/api/assessments", tags: ["Assessment"] })
		.post(
			"/",
			async ({ body, set }) => {
				try {
					const dto: CreateAssessmentControlDto = {
						count: body.count,
						maxCount: body.maxCount,
						context: body.context,
						type: body.type,
						isoAssessmentId: body.isoAssessmentId,
					};
					const control = await assessmentControlService.createAssessmentControl(dto);
					set.status = 201;
					return control;
				} catch (err) {
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Create assessment control" },
				body: t.Object({
					count: t.Number(),
					maxCount: t.Number(),
					context: t.String(),
					type: t.Union([
						t.Literal("PHYSICAL"),
						t.Literal("PEOPLE"),
						t.Literal("ORGANIZATION"),
						t.Literal("TECHNOLOGICAL"),
					]),
					isoAssessmentId: t.Number(),
				},
				{ additionalProperties: false }
			),
			}
		)
		.patch(
			"/:id",
			async ({ params, body, set }) => {
				try {
					const dto: UpdateAssessmentControlDto = {
						count: body.count,
						maxCount: body.maxCount,
						context: body.context,
						type: body.type,
						isoAssessmentId: body.isoAssessmentId,
					};
					return await assessmentControlService.updateAssessmentControl(params.id, dto);
				} catch (err) {
					if (err instanceof AssessmentControlNotFoundError) {
					set.status = 404;
					return { message: err.message };
					}
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Update assessment control" },
				params: t.Object({ id: t.Number() }),
				body: t.Object({
					count: t.Optional(t.Number()),
					maxCount: t.Optional(t.Number()),
					context: t.Optional(t.String()),
					type: t.Optional(t.Union([
						t.Literal("PHYSICAL"),
						t.Literal("PEOPLE"),
						t.Literal("ORGANIZATION"),
						t.Literal("TECHNOLOGICAL"),
					])),
					isoAssessmentId: t.Optional(t.Number()),
				},
				{ additionalProperties: false }
			),
			}
		)
		.get(
			"/:id",
			async ({ params, set }) => {
				try {
					return await assessmentControlService.getAssessmentControlById(params.id);
				} catch (err) {
					if (err instanceof AssessmentControlNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Get assessment control by id" },
				params: t.Object({ id: t.Number() }),
			}
		)
		.get(
			"/getAll",
			async () => {
				return await assessmentControlService.getAllAssessmentControls();
			},
			{
				detail: { summary: "Get all assessment controls" },
			}
		)
		.delete(
			"/:id",
			async ({ params, set }) => {
				try {
					set.status = 200;
					return await assessmentControlService.deleteAssessmentControl(params.id);
				} catch (err) {
					if (err instanceof AssessmentControlNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Delete assessment control by id" },
				params: t.Object({ id: t.Number() }),
			}
		);
