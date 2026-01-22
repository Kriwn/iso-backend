import { AssessmentControl, controls_type } from "../../generated/prisma/client";


export interface AssessmentControlEntity {
	id: number;
	assessmentId: number;
	description: string;
	type: controls_type;
	createdAt: Date;
	updatedAt: Date;
}


export function toAssessmentControlEntity(data: AssessmentControl): AssessmentControlEntity {
	return {
		id: data.id,
		assessmentId: data.isoAssessmentId,
		description: data.description,
		type: data.type,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}
