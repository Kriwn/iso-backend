import { control_status, Controls } from "../../generated/prisma/client";

export interface ControlEntity {
	id: number;
	code: string;
	name: string;
	currentPractice: string;
	description: string;
	guidance: string;
	assessmentControlId: number;
	status:	 control_status;
	updatedAt: Date;
	createdAt: Date;
}

export function toControlEntity(data: Controls){
	return {
		id: data.id,
		code: data.code,
		name: data.name,
		currentPractice: data.currentPractice,
		description: data.description,
		guidance: data.guidance,
		assessmentControlId: data.assessmentControlId,
		status: data.status,
		updatedAt: data.updatedAt,
		createdAt: data.createdAt,
	};
}
