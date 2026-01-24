import { EvidenceRepository } from "../../repositories/evidenceRepository";
import { CreateEvidenceDto, UpdateEvidenceDto } from "./evidenceDto";

export class EvidenceService {
	constructor(private evidenceRepository: EvidenceRepository) {}

	async createEvidence(data: CreateEvidenceDto) {
		return this.evidenceRepository.create(data);
	}

	async getEvidenceById(id: number) {
		return this.evidenceRepository.getById(id);
	}

	async getAllEvidence() {
		return this.evidenceRepository.getAll();
	}

	async getAllEvidenceByControlId(controlId: number) {
		return this.evidenceRepository.getAllByControlId(controlId);
	}

	async updateEvidence(id: number, data: UpdateEvidenceDto) {
		return this.evidenceRepository.update(id, data);
	}

	async deleteEvidence(id: number) {
		return this.evidenceRepository.delete(id);
	}

}
