import { AssessmentControlEntity } from "../entities/AssessmentControlEntity";
import { CreateAssessmentControlDto, UpdateAssessmentControlDto } from "../services/AssessmentControl/AssessmentControlDto";

export interface AssessmentControlRepository {
	create(data: CreateAssessmentControlDto): Promise<AssessmentControlEntity>;
	getById(id: number): Promise<AssessmentControlEntity | null>;
	getAll(): Promise<AssessmentControlEntity[]>;
	update(id: number, data: UpdateAssessmentControlDto): Promise<AssessmentControlEntity>;
	delete(id: number): Promise<AssessmentControlEntity>;

}
