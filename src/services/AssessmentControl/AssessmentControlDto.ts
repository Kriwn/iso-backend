import { control_status} from "../../../generated/prisma/enums";

//TODO Recheck fields
export interface CreateAssessmentControlDto	{
	count: number;
	maxCount: number;
	context: string;
	type: control_status;
	isoAssessmentId: number;
}

export interface UpdateAssessmentControlDto {
	count?: number;
	maxCount?: number;
	context?: string;
	type?: control_status;
	isoAssessmentId?: number;
}
