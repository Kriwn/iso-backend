export class CompanyNotFoundError extends Error {
	constructor(id: number) {
		super(`Company with ID ${id} not found`);
		this.name = "CompanyNotFoundError";
	}
}

export class CompanyCodeNotFoundError extends Error {
	constructor(code: string) {
		super(`Company with Code ${code} not found`);
		this.name = "CompanyNotFoundError";
	}
}


export class CompanyCodeAlreadyExistsError extends Error {
	constructor(code: string) {
		super(`Company with code ${code} already exists`);
		this.name = "CompanyCodeAlreadyExistsError";
	}
}
