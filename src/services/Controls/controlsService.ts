import { ControlsRepository } from "../../repositories/ControlsRepository";
import { CreateControlDto, UpdateControlDto } from "./ControlsDto";

export class ControlsService {
	constructor(private controlsRepository: ControlsRepository) {}

	async createControl(data: CreateControlDto) {
		return this.controlsRepository.create(data);
	}

	async getControlById(id: number) {
		return this.controlsRepository.getById(id);
	}

	async getAllControls() {
		return this.controlsRepository.getAll();
	}

	async updateControl(id: number, data: UpdateControlDto) {
		return this.controlsRepository.update(id, data);
	}

	async deleteControl(id: number) {
		return this.controlsRepository.delete(id);
	}
}
