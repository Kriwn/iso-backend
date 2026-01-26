import { AssessmentControlRepository } from "../../repositories/assessmentControlRepository";
import { CreateAssessmentControlDto, UpdateAssessmentControlDto } from "./assessmentControlDto";

export class AssessmentControlService {
	constructor(private assessmentControlRepository: AssessmentControlRepository) {}

	async createAssessmentControl(data: CreateAssessmentControlDto) {
		return this.assessmentControlRepository.create(data);
	}

	async getAssessmentControlById(id: number) {
		return this.assessmentControlRepository.getById(id);
	}

	async getAllAssessmentControls() {
		return this.assessmentControlRepository.getAll();
	}

	async getAllAssessmentControlsByIsoAssessmentId(isoAssessmentId: number) {
		return this.assessmentControlRepository.getAllByIsoAssessmentId(isoAssessmentId);
	}

	async updateAssessmentControl(id: number, data: UpdateAssessmentControlDto) {
		return this.assessmentControlRepository.update(id, data);
	}

	async deleteAssessmentControl(id: number) {
		return this.assessmentControlRepository.delete(id);
	}
}
