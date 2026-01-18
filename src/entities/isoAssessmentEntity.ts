import { IsoAssessment } from "../../generated/prisma/client";

export type IsoStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED";


export interface IsoAssessmentEntity {
	id: number;
	name: string;
	year: number;
	status: IsoStatus;
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
