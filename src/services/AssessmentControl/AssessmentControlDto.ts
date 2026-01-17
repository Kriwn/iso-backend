import { AssessmentControlType } from "../../entities/AssessmentControlEntity";

//TODO Recheck fields
export interface CreateAssessmentControlDto	{
	count: number;
	maxCount: number;
	context: string;
	type: AssessmentControlType;
	isoAssessmentId: number;
}

export interface UpdateAssessmentControlDto {
	count?: number;
	maxCount?: number;
	context?: string;
	type?: AssessmentControlType;
	isoAssessmentId?: number;
}
