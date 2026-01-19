import { Evidence } from "../../generated/prisma/client";

export interface EvidenceEntity {
	id: number;
	fileName: string;
	filePath: string;
	controlId: number;
	createdAt: Date;
	updatedAt: Date;
}

export function toEvidenceEntity(data: Evidence): EvidenceEntity {
	return {
		id: data.id,
		fileName: data.fileName,
		filePath: data.filePath,
		controlId: data.controlId,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}
