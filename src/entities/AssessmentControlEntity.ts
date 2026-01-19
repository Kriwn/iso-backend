import { AssessmentControl, controls_type } from "../../generated/prisma/client";


export interface AssessmentControlEntity {
	id: number;
	assessmentId: number;
	count: number;
	maxCount: number;
	context: string;
	type: controls_type;
	createdAt: Date;
	updatedAt: Date;
}


export function toAssessmentControlEntity(data: AssessmentControl): AssessmentControlEntity {
	return {
		id: data.id,
		assessmentId: data.isoAssessmentId,
		count: data.count,
		maxCount: data.maxCount,
		context: data.context,
		type: data.type,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}
