import { Param } from "@prisma/client/runtime/client";
import { IsoAssessmentNotFoundError, IsoAssessmentYearAlreadyExistsError } from "../errors/isoAssessmentError";
import { CreateIsoAssessmentDto } from "../services/isoAssessment/isoAssessmentDto";
import Elysia, { t } from "elysia";
import { IsoAssessmentService } from "../services/isoAssessment/isoAssessmentService";
import { iso_status } from "../../generated/prisma/enums";

const IsoAssessmentStatusEnum = {
  	DRAFT: iso_status.DRAFT,
  	IN_PROGRESS: iso_status.IN_PROGRESS,
  	COMPLETED: iso_status.COMPLETED,
} as const;

type IsoAssessmentStatus =
	(typeof IsoAssessmentStatusEnum)[keyof typeof IsoAssessmentStatusEnum];

export const isoAssessmentController =(isoAssessmentService: IsoAssessmentService) =>
	new Elysia({ prefix: "/api/iso-assessments", tags: ["ISO Assessment"] })
		.post(
			"/",
			async ({ body, set }) => {
				try {
					const dto: CreateIsoAssessmentDto = {
						name: body.name,
						year: body.year,
						companyId: body.companyId,
					}
					const isoAssessment = await isoAssessmentService.createIso(dto);
					set.status = 201;
					return isoAssessment;
				} catch (err) {
					if (err instanceof IsoAssessmentYearAlreadyExistsError) {
						set.status = 409;
						return { message: err.message };
					}
					set.status = 500;
					return { message: "Internal Server Error"};
				}
			},
			{
				detail: { summary: "Create ISO Assessment" },
				body: t.Object(
					{
						name: t.String(),
						year: t.Number(),
						companyId: t.Number(),
					},
					{ additionalProperties: false }
				),
			}
		)
		.get(
			"/:id",
			async ({ params, set }) => {
				try {
					return await isoAssessmentService.getIsoById(params.id);
				} catch (err) {
					if (err instanceof IsoAssessmentNotFoundError) {
						set.status = 404;
						return { message: err.message };
					} else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Get ISO Assessment by ID" },
				params: t.Object({
					id: t.Number(),
				}),
			}
		)
		.get(
			"/",
			async ({ set }) => {
				try {
					return await isoAssessmentService.getAllIso();
				} catch (err) {
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Get all ISO Assessments" },
			}
		)
		.get(
			"/company/:companyId",
			async ({ params, set }) => {
				try {
					return await isoAssessmentService.getAllIsoByCompanyId(params.companyId);
				} catch (err) {
					set.status = 500;
					return { message: "Internal Server Error" };
				}
			},
			{
				detail: { summary: "Get ISO Assessments by Company ID" },
				params: t.Object({
					companyId: t.Number(),
				}),
			}
		)
		.patch(
			"/:id",
			async ({ params, body, set }) => {
				try {
					const updatedIso = await isoAssessmentService.updateIso(params.id, body);
					return updatedIso;
				} catch (err) {
					if (err instanceof IsoAssessmentNotFoundError) {
						set.status = 404;
						return { message: err.message };
					} else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Update ISO Assessment by ID" },
				params: t.Object({
					id: t.Number(),
				}),
				body: t.Object(
					{
						name: t.Optional(t.String()),
						year: t.Optional(t.Number()),
						status: t.Optional(t.Enum(IsoAssessmentStatusEnum)),
					},
					{ additionalProperties: false }
				),
			}
		)
		.delete(
			"/:id",
			async ({ params, set }) => {
				try {
					await isoAssessmentService.deleteIso(params.id);
					set.status = 204;
					return;
				} catch (err) {
					if (err instanceof IsoAssessmentNotFoundError) {
						set.status = 404;
						return { message: err.message };
					} else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Delete ISO Assessment by ID" },
				params: t.Object({
					id: t.Number(),
				}),
			}
		);
