import { EvidenceEntity } from "../entities/evidenceEntity";
import { createEvidenceDto, updateEvidenceDto } from "../services/evidence/evidenceDto";

export interface EvidenceRepository {
	create(data: createEvidenceDto): Promise<EvidenceEntity>;
	update(id: number, data: updateEvidenceDto): Promise<EvidenceEntity>;
	delete(id: number): Promise<void>;
	getAllByControlId(controlId: number): Promise<EvidenceEntity[]>;
	getById(id: number): Promise<EvidenceEntity | null>;
	getAll(): Promise<EvidenceEntity[]>;
}
