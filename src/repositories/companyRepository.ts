import { CompanyEntity } from "../entities/companyEntity";
import { CreateCompanyDto, UpdateCompanyDto, UpdatePrivateCompanyDto } from "../services/company/companyDto";

export interface CompanyRepository {
	create(data: CreateCompanyDto): Promise<CompanyEntity>;

	getById(id: number): Promise<CompanyEntity | null>;
	getByCode(code: string): Promise<CompanyEntity | null>;
	getAll(): Promise<CompanyEntity[]>;

	update(id: number, data: UpdateCompanyDto): Promise<CompanyEntity>;
	updatePrivate(id: number, data: UpdatePrivateCompanyDto): Promise<CompanyEntity>;

	delete(id: number): Promise<void>;
}
