import { CompanyEntity } from "../entities/companyEntity";
import { CreateCompanyDto, UpdateCompanyDto, UpdatePrivateCompanyDto } from "../services/company/companydto";

export interface CompanyRepository {
	getById(id: number): Promise<CompanyEntity | null>;
	getByCode(code: string): Promise<CompanyEntity | null>;
	getAll(): Promise<CompanyEntity[]>;
	create(data: CreateCompanyDto): Promise<CompanyEntity>;
	update(id: number, data: UpdateCompanyDto): Promise<CompanyEntity>;
	updatePrivate(id: number, data: UpdatePrivateCompanyDto): Promise<CompanyEntity>;
	delete(id: number): Promise<void>;
}
