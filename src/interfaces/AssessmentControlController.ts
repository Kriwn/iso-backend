import Elysia, { t } from "elysia";
import { AssessmentControlService } from "../services/assessmentControl/assessmentControlService";
import { CreateAssessmentControlDto, UpdateAssessmentControlDto } from "../services/assessmentControl/assessmentControlDto";
import { AssessmentControlNotFoundError } from "../errors/assessmentControlError";
import { controls_type } from "../../generated/prisma/client";

const AssessmentControlTypeEnum = {
  PHYSICAL: controls_type.PHYSICAL,
  PEOPLE: controls_type.PEOPLE,
  ORGANIZATION: controls_type.ORGANIZATION,
  TECHNOLOGICAL: controls_type.TECHNOLOGICAL,
} as const;

type AssessmentControlType =
  (typeof AssessmentControlTypeEnum)[keyof typeof AssessmentControlTypeEnum];

export const assessmentControlController= (assessmentControlService: AssessmentControlService) =>
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
					type: t.Enum(AssessmentControlTypeEnum),
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
					type: t.Optional(t.Enum(AssessmentControlTypeEnum)),
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
					await assessmentControlService.deleteAssessmentControl(params.id);
					set.status = 204;
					return;
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
