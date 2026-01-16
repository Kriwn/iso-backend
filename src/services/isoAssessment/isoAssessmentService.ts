import { IsoAssessmentRepository } from "../../repositories/isoAssessmentRepository";
import { CreateIsoAssessmentDto } from "./isoAssessmentDto";

export class IsoAssessmentService {
	constructor(private isoAssessmentRepository: IsoAssessmentRepository) {}

	async createIso(data: CreateIsoAssessmentDto) {
		return this.isoAssessmentRepository.create(data);
	}

	async getIsoById(id: number) {
		return this.isoAssessmentRepository.getById(id);
	}

	async getAllIso() {
		return this.isoAssessmentRepository.getAll();
	}

	async getAllIsoByCompanyId(companyId: number) {
		return this.isoAssessmentRepository.getAllByCompanyId(companyId);
	}

	async updateIso(id: number, data: any) {
		return this.isoAssessmentRepository.update(id, data);
	}

	async updatePrivateIso(id: number, data: any) {
		return this.isoAssessmentRepository.updatePrivate(id, data);
	}

	async deleteIso(id: number) {
		return this.isoAssessmentRepository.delete(id);
	}
}
