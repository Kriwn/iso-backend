export class AssessmentControlNotFoundError extends Error {
	constructor(id: number) {
		super(`AssessmentControl with ID ${id} not found`);
		this.name = "AssessmentControlNotFoundError";
	}
}
