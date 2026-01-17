export type AssessmentControlType = "PHYSICAL" | "PEOPLE" | "ORGANIZATION" | "TECHNOLOGICAL";

export interface AssessmentControlEntity {
	id: number;
	assessmentId: number;
	controlId: number;
	status: AssessmentControlType;
	evidenceUrl?: string | null;
	comments?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export function toAssessmentControlEntity(data: any): AssessmentControlEntity {
	return {
		id: data.id,
		assessmentId: data.assessmentId,
		controlId: data.controlId,
		status: data.status,
		evidenceUrl: data.evidenceUrl,
		comments: data.comments,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}
