import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { CompanyEntity, toCompanyEntity } from "../../../../entities/companyEntity";
import { CompanyCodeAlreadyExistsError, CompanyCodeNotFoundError, CompanyNotFoundError } from "../../../../errors/companyError";
import { CompanyRepository } from "../../../../repositories/companyRepository";
import { CreateCompanyDto, UpdateCompanyDto, UpdatePrivateCompanyDto } from "../../../../services/company/companyDto";

export class PrismaCompanyRepository implements CompanyRepository {

	constructor(private prisma: PrismaClient) {}

	async create(data: CreateCompanyDto): Promise<CompanyEntity> {
		try {
			const res = await this.prisma.company.create({ data });
			return toCompanyEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new CompanyCodeAlreadyExistsError(data.code);
			}
			throw error;
		}
	}

	async update(id: number, data: UpdateCompanyDto): Promise<CompanyEntity> {
		try {
			const res = await this.prisma.company.update({
				where: { id },
				data: data,
			});
			return toCompanyEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new CompanyNotFoundError(id);
			}
			throw error;
		}
	}

	async updatePrivate(id: number, data: UpdatePrivateCompanyDto): Promise<CompanyEntity> {
		try {
			const res = await this.prisma.company.update({
				where: { id },
				data: data,
			});
			return toCompanyEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new CompanyNotFoundError(id);
			}
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new CompanyCodeAlreadyExistsError(data.code!);
			}
			throw error;
		}
	}

	async getById(id: number): Promise<CompanyEntity | null> {
		const res = await this.prisma.company.findUnique({
			where: { id },
		});
		if (!res) {
			throw new CompanyNotFoundError(id);
		}
		return toCompanyEntity(res);
	}

	async getByCode(code: string): Promise<CompanyEntity | null> {
		const res = await this.prisma.company.findUnique({
			where: { code },
		});
		if (!res) {
			throw new CompanyCodeNotFoundError(code);
		}
		return toCompanyEntity(res);
	}

	async getAll(): Promise<CompanyEntity[]> {
		const res = await this.prisma.company.findMany();
		return res.map(toCompanyEntity);
	}

	async delete(id: number): Promise<void> {
		try {
			await this.prisma.company.delete({
				where: { id },
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new CompanyNotFoundError(id);
			}
			throw error;
		}
	}
}
