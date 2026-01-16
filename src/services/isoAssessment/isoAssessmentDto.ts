import { IsoStatus } from "../../entities/isoAssessmentEntity";

export interface CreateIsoAssessmentDto {
	name: string;
	year: number;
	companyId: number;
}

export interface UpdateIsoAssessmentDto {
	name?: string;
	year?: number;
	status?: IsoStatus;
}


export interface UpdatePrivateIsoAssessmentDto {
	name?: string;
	year?: number;
	companyId?: number;
	status?: IsoStatus;
}
