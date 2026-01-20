import { iso_status, IsoAssessment } from "../../generated/prisma/client";

export interface IsoAssessmentEntity {
	id: number;
	name: string;
	year: number;
	status: iso_status;
	companyId: number;
	createdAt: Date;
	updatedAt: Date;
}

export function toIsoAssessmentEntity(isoAssessment: IsoAssessment): IsoAssessmentEntity {
	return {
		id: isoAssessment.id,
		name: isoAssessment.name,
		year: isoAssessment.year,
		status: isoAssessment.status,
		companyId: isoAssessment.companyId,
		createdAt: isoAssessment.createdAt,
		updatedAt: isoAssessment.updatedAt,
	};
}
