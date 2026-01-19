import { ControlStatus } from "../../entities/ControlsEntity";

export interface CreateControlDto {
	code: string;
	name: string;
	currentPractice: string;
	description: string;
	assessmentControlId: number;
	status:	 ControlStatus;
}

export interface UpdateControlDto {
	code?: string;
	name?: string;
	currentPractice?: string;
	description?: string;
	assessmentControlId?: number;
	status?: ControlStatus;
}
