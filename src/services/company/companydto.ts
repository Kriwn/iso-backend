export interface CreateCompanyDto {
	name: string;
	code: string;
	details?: string;
	image?: string | null;
}

export interface UpdateCompanyDto {
	name?: string;
	details?: string;
	image?: string | null;
}

export interface UpdatePrivateCompanyDto {
	name?: string;
	code?: string;
	details?: string;
	image?: string | null;
}
