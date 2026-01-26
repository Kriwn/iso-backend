import { ControlEntity } from "../entities/controlsEntity";
import { CreateControlDto, UpdateControlDto } from "../services/controls/controlsDto";

export interface ControlsRepository {
	create(data: CreateControlDto): Promise<ControlEntity>;
	getById(id: number): Promise<ControlEntity | null>;
	createManyWithTx(tx: any, data: CreateControlDto[]): Promise<ControlEntity[]>;
	getAllByAssessmentControlId(assessmentControlId: number): Promise<ControlEntity[]>;
	getAll(): Promise<ControlEntity[]>;
	update(id: number, data: UpdateControlDto): Promise<ControlEntity>;
	delete(id: number): Promise<void>;
}
