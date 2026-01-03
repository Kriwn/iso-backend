import { Company } from "../../generated/prisma/client";

export interface CompanyEntity {
	id: number;
	name: string;
	code: string;
	details: string
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export function toCompanyEntity(company: Company): CompanyEntity {
	return {
		id: company.id,
		name: company.name,
		code: company.code,
		details: company.details ?? "",
		image: company.image ?? null,
		createdAt: company.createdAt,
		updatedAt: company.updatedAt,
	};
}
