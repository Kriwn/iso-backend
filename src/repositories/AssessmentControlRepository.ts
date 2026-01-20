import { AssessmentControlEntity } from "../entities/assessmentControlEntity";
import { CreateAssessmentControlDto, UpdateAssessmentControlDto } from "../services/assessmentControl/assessmentControlDto";

export interface AssessmentControlRepository {
	create(data: CreateAssessmentControlDto): Promise<AssessmentControlEntity>;
	getById(id: number): Promise<AssessmentControlEntity | null>;
	getAll(): Promise<AssessmentControlEntity[]>;
	update(id: number, data: UpdateAssessmentControlDto): Promise<AssessmentControlEntity>;
	delete(id: number): Promise<void>;

}
