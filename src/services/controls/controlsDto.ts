import { control_status } from "../../../generated/prisma/enums";

export interface CreateControlDto {
	code: string;
	name: string;
	description: string;
	guidance: string;
	assessmentControlId: number;
	status?:	 control_status;
	currentPractice?: string;
	userContext?: string;
	evidenceDescription?: string;
}

export interface UpdateControlDto {
	currentPractice?: string;
	assessmentControlId?: number;
	userContext?: string;
	evidenceDescription?: string;
	status?: control_status;
}
