import { control_status } from "../../../generated/prisma/enums";

export interface CreateControlDto {
	code: string;
	name: string;
	currentPractice: string;
	description: string;
	userContext?: string;
	evidenceDescription?: string;
	guidance: string;
	assessmentControlId: number;
	status:	 control_status;
}

export interface UpdateControlDto {
	currentPractice?: string;
	assessmentControlId?: number;
	userContext?: string;
	evidenceDescription?: string;
	status?: control_status;
}
