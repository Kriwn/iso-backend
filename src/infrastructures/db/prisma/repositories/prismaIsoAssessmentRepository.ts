import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { IsoAssessmentEntity, toIsoAssessmentEntity } from "../../../../entities/isoAssessmentEntity";
import { CompanyNotFoundError } from "../../../../errors/companyError";
import { IsoAssessmentNotFoundError, IsoAssessmentYearAlreadyExistsError } from "../../../../errors/isoAssessmentError";
import { IsoAssessmentRepository } from "../../../../repositories/isoAssessmentRepository";
import { CreateIsoAssessmentDto, UpdateIsoAssessmentDto} from "../../../../services/isoAssessment/isoAssessmentDto";

export class PrismaIsoAssessmentRepository implements IsoAssessmentRepository {

	constructor(private prisma: PrismaClient) {}

	async create(data: CreateIsoAssessmentDto): Promise<IsoAssessmentEntity> {
		try {
			const res = await this.prisma.isoAssessment.create({ data })
			return toIsoAssessmentEntity(res);
		} catch (error) {
			throw error;
		}
	}

	async createWithTx(tx: Prisma.TransactionClient, data: CreateIsoAssessmentDto): Promise<IsoAssessmentEntity> {
		try {
			const res = await tx.isoAssessment.create({ data });
			return toIsoAssessmentEntity(res);
		}
		catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
			{
				throw new IsoAssessmentYearAlreadyExistsError(data.year);
			}
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003')
			{
				throw new CompanyNotFoundError(data.companyId);
			}
			throw error;
		}
	}

	async getAll(): Promise<IsoAssessmentEntity[]> {
		const res = await this.prisma.isoAssessment.findMany();
		return res.map(toIsoAssessmentEntity);
	}

	async getById(id: number): Promise<IsoAssessmentEntity | null> {
		const res = await this.prisma.isoAssessment.findUnique({
			where: { id },
		});
		if (!res) {
			throw new IsoAssessmentNotFoundError(id);
		}
		return toIsoAssessmentEntity(res);
	}

	async getAllByCompanyId(companyId: number): Promise<IsoAssessmentEntity[]> {
		const res = await this.prisma.isoAssessment.findMany({
			where: { companyId },
		});
		return res.map(toIsoAssessmentEntity);
	}

	async update(id: number, data: UpdateIsoAssessmentDto): Promise<IsoAssessmentEntity> {
		try {
			const res = await this.prisma.isoAssessment.update({
				where: { id },
				data: data,
			});
			return toIsoAssessmentEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new IsoAssessmentNotFoundError(id);
			}
			throw error;
		}
	}

	async delete(id: number): Promise<void> {
		try {
			await this.prisma.isoAssessment.delete({
				where: { id },
			});
			return ;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new IsoAssessmentNotFoundError(id);
			}
			throw error;
		}
	}
}
