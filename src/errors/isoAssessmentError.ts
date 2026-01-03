export class IsoAssessmentNotFoundError extends Error {
	constructor(id: number) {
		super(`ISO Assessment with ID ${id} not found`);
		this.name = "IsoAssessmentNotFoundError";
	}
}
