import { ControlEntity } from "../entities/controlsEntity";
import { CreateControlDto, UpdateControlDto } from "../services/controls/controlsDto";

// create suggestion psas only id methods and return llm answers?
export interface ControlsRepository {
	create(data: CreateControlDto): Promise<ControlEntity>;
	getById(id: number): Promise<ControlEntity | null>;
	getAll(): Promise<ControlEntity[]>;
	update(id: number, data: UpdateControlDto): Promise<ControlEntity>;
	delete(id: number): Promise<void>;
}
