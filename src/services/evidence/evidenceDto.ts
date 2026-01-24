export interface CreateEvidenceDto {
	fileName: string;
	filePath: string;
	controlId: number;
}

export interface UpdateEvidenceDto {
	fileName?: string;
	filePath?: string;
	controlId?: number;
}
