import { CompanyRepository } from "../../repositories/companyRepository";
import { CreateCompanyDto, UpdateCompanyDto, UpdatePrivateCompanyDto } from "./companydto";

export class CompanyService {
	constructor(private companyRepository: CompanyRepository) {}

	async createCompany(data: CreateCompanyDto) {
		return this.companyRepository.create(data);
	}

	async updateCompany(id: number, data: UpdateCompanyDto) {
		return this.companyRepository.update(id, data);
	}

	async updatePrivateCompany(id: number, data: UpdatePrivateCompanyDto) {
		return this.companyRepository.updatePrivate(id, data);
	}

	async getCompanyById(id: number) {
		return this.companyRepository.getById(id);
	}

	async getCompanyByCode(code: string) {
		return this.companyRepository.getByCode(code);
	}

	async getAllCompanies() {
		return this.companyRepository.getAll();
	}

	async deleteCompany(id: number) {
		return this.companyRepository.delete(id);
	}
}
