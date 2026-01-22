import { controls_type} from "../../../generated/prisma/enums";

export interface CreateAssessmentControlDto	{
	description: string;
	type: controls_type;
	isoAssessmentId: number;
}

export interface UpdateAssessmentControlDto {
	description?: string;
	type?: controls_type;
}


export function createAssessmentControlDto(description: string,type: controls_type,isoAssessmentId: number): CreateAssessmentControlDto {
	return {
		description: description,
		type: type,
		isoAssessmentId: isoAssessmentId,
	};
}
