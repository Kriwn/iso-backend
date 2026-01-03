export interface CreateIsoAssessmentDto {
	name: string;
	year: number;
	companyId: number;
}

export interface UpdateIsoAssessmentDto {
	name?: string;
	year?: number;
	status?: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
}


export interface UpdatePrivateIsoAssessmentDto {
	name?: string;
	year?: number;
	companyId?: number;
	status?: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
}
