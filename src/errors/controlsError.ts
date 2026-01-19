export class ControlNotFoundError extends Error {
	constructor(id: number) {
		super(`Control with ID ${id} not found`);
		this.name = "ControlNotFoundError";
	}
}
