import { AssessmentControl, Controls, controls_type } from "../../generated/prisma/client";


export interface AssessmentControlEntity {
	id: number;
	isoAssessmentId: number;
	description: string;
	type: controls_type;
	createdAt: Date;
	updatedAt: Date;
}

export function toAssessmentControlEntity(data: AssessmentControl): AssessmentControlEntity {
	return {
		id: data.id,
		isoAssessmentId: data.isoAssessmentId,
		description: data.description,
		type: data.type,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}
