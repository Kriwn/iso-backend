export interface createEvidenceDto {
	fileName: string;
	filePath: string;
	controlId: number;
}

export interface updateEvidenceDto {
	fileName?: string;
	filePath?: string;
	controlId?: number;
}
