import { controls_type} from "../../../generated/prisma/enums";

export interface CreateAssessmentControlDto	{
	count?: number;
	maxCount: number;
	context: string;
	type: controls_type;
	isoAssessmentId: number;
}

export interface UpdateAssessmentControlDto {
	count?: number;
	maxCount?: number;
	context?: string;
	type?: controls_type;
	isoAssessmentId?: number;
}


export function createAssessmentControlDto(maxCount: number,context: string,type: controls_type,isoAssessmentId: number): CreateAssessmentControlDto {
	return {
		maxCount: maxCount,
		context: context,
		type: type,
		isoAssessmentId: isoAssessmentId,
	};
}
