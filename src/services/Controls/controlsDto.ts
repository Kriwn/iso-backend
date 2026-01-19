// import { ControlStatus } from "../../entities/ControlsEntity";

import { control_status } from "../../../generated/prisma/enums";

// TODO wtf
export interface CreateControlDto {
	code: string;
	name: string;
	currentPractice: string;
	description: string;
	assessmentControlId: number;
	status:	 control_status;
}

export interface UpdateControlDto {
	code?: string;
	name?: string;
	currentPractice?: string;
	description?: string;
	assessmentControlId?: number;
	status?: control_status;
}
