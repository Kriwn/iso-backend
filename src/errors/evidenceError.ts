export class EvidenceNotFoundError extends Error {
	constructor(id: number) {
		super(`Evidence with ID ${id} not found.`);
		this.name = "EvidenceNotFoundError";
	}
}

export class EvidenceAlreadyExistsError extends Error {
	constructor(filename: string) {
		super(`evidence filename: ${filename} already exists.`);
		this.name = "EvidenceAlreadyExistsError";
	}
}
