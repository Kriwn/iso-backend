import { AssessmentControlRepository } from "../../repositories/assessmentControlRepository";
import { CreateAssessmentControlDto, UpdateAssessmentControlDto } from "./assessmentControlDto";

//TODO hangle update wrong company id
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

	async updateAssessmentControl(id: number, data: UpdateAssessmentControlDto) {
		return this.assessmentControlRepository.update(id, data);
	}

	async deleteAssessmentControl(id: number) {
		return this.assessmentControlRepository.delete(id);
	}
}
