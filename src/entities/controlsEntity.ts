import { Controls } from "../../generated/prisma/client";

export type ControlStatus =  "NOT_IMPLEMENTED" | "PARTIALLY" | "IMPLEMENTED";

//TODO change type to enum
// export enum ControlStatusEnum {
// 	NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
// 	PARTIALLY = "PARTIALLY",
// 	IMPLEMENTED = "IMPLEMENTED",
// }

export interface ControlEntity {
	id: number;
	code: string;
	name: string;
	currentPractice: string;
	description: string;
	assessmentControlId: number;
	status:	 ControlStatus;
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
		assessmentControlId: data.assessmentControlId,
		status: data.status,
		updatedAt: data.updatedAt,
		createdAt: data.createdAt,
	};
}
