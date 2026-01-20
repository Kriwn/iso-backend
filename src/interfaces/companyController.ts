import Elysia, { t } from "elysia";
import { CompanyService } from "../services/company/companyService";
import { CompanyCodeAlreadyExistsError, CompanyNotFoundError } from "../errors/companyError";
import { CreateCompanyDto, UpdateCompanyDto, UpdatePrivateCompanyDto } from "../services/company/companyDto";

export const CompanyController= (companyService: CompanyService) =>
	new Elysia({ prefix: "/api/companies", tags: ["Company"] })
		.post(
			"/",
			async ({ body, set }) => {
				try {
					const dto:CreateCompanyDto = {
						name: body.name,
						code: body.code,
						details: body.details,
						image: body.image,
					}
					const company = await companyService.createCompany(dto);
					set.status = 201;
					return company;
				} catch (err) {
					if (err instanceof CompanyCodeAlreadyExistsError) {
						set.status = 409;
						return { message: err.message };
					}
					else {
						set.status = 500;
					return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Create company" },
				body: t.Object({
					name: t.String(),
					code: t.String(),
					details: t.String(),
					image: t.Optional(t.String({ format: "uri" })),
				},
				{ additionalProperties: false }
			),
			}
		)
		.patch(
			"/:id",
			async ({ params, body, set }) => {
				try {
					const dto: UpdateCompanyDto = {
						name: body.name,
						details: body.details,
						image: body.image,
					}
					return await companyService.updateCompany(params.id, dto);
				} catch (err) {
					if (err instanceof CompanyNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Update company" },
				params: t.Object({ id: t.Number() }),
				body: t.Object(
					{
						name: t.Optional(t.String()),
						details: t.Optional(t.String()),
						image: t.Optional(t.String({ format: "uri" })),
					},
					{ additionalProperties: false }
				),
			}
		)
		.patch(
			"/private/:id",
			async ({ params, body, set }) => {
				try {
					const dto: UpdatePrivateCompanyDto = {
						name: body.name,
						code: body.code,
						details: body.details,
						image: body.image,
					}
					return await companyService.updatePrivateCompany(params.id, dto);
				} catch (err) {
					if (err instanceof CompanyNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					else if (err instanceof CompanyCodeAlreadyExistsError) {
						set.status = 409;
						return { message: err.message };
					}
					else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Update private company" },
				params: t.Object({ id: t.Number() }),
				body: t.Object(
					{
						name: t.Optional(t.String()),
						code: t.Optional(t.String()),
						details: t.Optional(t.String()),
						image: t.Optional(t.String({ format: "uri" })),
					},
					{ additionalProperties: false }
				),
			}
		)
		.get(
			"/:id",
			async ({ params, set }) => {
				try {
					return await companyService.getCompanyById(params.id);
				} catch (err) {
					if (err instanceof CompanyNotFoundError) {
					set.status = 404;
					return { message: err.message };
					}
					else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Get company by id" },
				params: t.Object({ id: t.Number() }),
			}
		)
		.get(
			"/",
			async () => {
				return await companyService.getAllCompanies();
			},
			{
				detail: { summary: "Get all companies" },
			}
		)
		.get(
			"/getByCode/:code",
			async ({ params, set }) => {
				try {
					return await companyService.getCompanyByCode(params.code);
				} catch (err) {
					if (err instanceof CompanyNotFoundError) {
					set.status = 404;
					return { message: err.message };
					}
					else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Get company by code" },
				params: t.Object({ code: t.String() }),
			}
		)
		.delete(
			"/:id",
			async ({ params, set }) => {
				try {
					await companyService.deleteCompany(params.id);
					set.status = 204;
					return;
				} catch (err) {
					if (err instanceof CompanyNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Delete company" },
				params: t.Object({ id: t.Number() }),
			}
		);
