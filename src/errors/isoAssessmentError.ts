export class IsoAssessmentNotFoundError extends Error {
	constructor(id: number) {
		super(`ISO Assessment with ID ${id} not found`);
		this.name = "IsoAssessmentNotFoundError";
	}
}

export class IsoAssessmentYearAlreadyExistsError extends Error {
	constructor(year: number) {
		super(`ISO Assessment with year ${year} already exists`);
		this.name = "IsoAssessmentYearAlreadyExistsError";
	}
}
