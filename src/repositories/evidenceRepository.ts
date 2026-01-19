import { EvidenceEntity } from "../entities/evidenceEntity";
import { createEvidenceDto, updateEvidenceDto } from "../services/Evidence/evidenceDto";

export interface evidenceRepository {
	create(data: createEvidenceDto): Promise<EvidenceEntity>;
	update(id: number, data: updateEvidenceDto): Promise<EvidenceEntity>;
	delete(id: number): Promise<EvidenceEntity>;
	getAllByControlId(controlId: number): Promise<EvidenceEntity[]>;
	getById(id: number): Promise<EvidenceEntity | null>;
	getAll(): Promise<EvidenceEntity[]>;
}
