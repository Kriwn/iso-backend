export class ControlNotFoundError extends Error {
	constructor(id: number) {
		super(`Control with ID ${id} not found`);
		this.name = "ControlNotFoundError";
	}
}

export class ControlCodeAlreadyExistsError extends Error {
	constructor(code: string,assessmentControlId: number) {
		super(`Control with code ${code} already exists in Assessment Control ID ${assessmentControlId}`);
		this.name = "ControlCodeAlreadyExistsError";
	}
}
