import { ControlEntity } from "../entities/ControlsEntity";
import { CreateControlDto, UpdateControlDto } from "../services/Controls/controlsDto";

export interface ControlsRepository {
	create(data: CreateControlDto): Promise<ControlEntity>;
	getById(id: number): Promise<ControlEntity | null>;
	getAll(): Promise<ControlEntity[]>;
	update(id: number, data: UpdateControlDto): Promise<ControlEntity>;
	delete(id: number): Promise<ControlEntity>;
}
