import { iso_status } from "../../../generated/prisma/enums";

export interface CreateIsoAssessmentDto {
	name: string;
	year: number;
	companyId: number;
}

export interface UpdateIsoAssessmentDto {
	name?: string;
	year?: number;
	status?: iso_status;
}
