import { EvidenceEntity } from "../entities/evidenceEntity";
import { CreateEvidenceDto, UpdateEvidenceDto } from "../services/evidence/evidenceDto";

export interface EvidenceRepository {
	create(data: CreateEvidenceDto): Promise<EvidenceEntity>;
	update(id: number, data: UpdateEvidenceDto): Promise<EvidenceEntity>;
	delete(id: number): Promise<void>;
	getAllByControlId(controlId: number): Promise<EvidenceEntity[]>;
	getById(id: number): Promise<EvidenceEntity | null>;
	getAll(): Promise<EvidenceEntity[]>;
}
