import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { AssessmentControlEntity, toAssessmentControlEntity } from "../../../../entities/AssessmentControlEntity";
import { AssessmentControlNotFoundError } from "../../../../errors/assessmentControlError";
import { AssessmentControlRepository } from "../../../../repositories/assessmentControlRepository";
import { CreateAssessmentControlDto, UpdateAssessmentControlDto } from "../../../../services/assessmentControl/assessmentControlDto";

export class PrismaAssessmentControlRepository implements AssessmentControlRepository {
	constructor(private prisma: PrismaClient) {}

	async create(data: CreateAssessmentControlDto): Promise<AssessmentControlEntity> {
		try {
			const res = await this.prisma.assessmentControl.create({ data });
			return toAssessmentControlEntity(res);
		} catch (error) {
			throw error;
		}
	}

	async createManyWithTx(tx: Prisma.TransactionClient, data: CreateAssessmentControlDto[]): Promise<AssessmentControlEntity[]> {
		const res: AssessmentControlEntity[] = [];
		for (const dto of data) {
			const created = await tx.assessmentControl.create({ data: dto });
			res.push(toAssessmentControlEntity(created));
		}
		return res;
	}

	async getById(id: number): Promise<AssessmentControlEntity | null> {
		const res = await this.prisma.assessmentControl.findUnique({
			where: { id },
		});
		if (!res) {
			throw new AssessmentControlNotFoundError(id);
		}
		return toAssessmentControlEntity(res);
	}

	async getAll(): Promise<AssessmentControlEntity[]> {
		const res = await this.prisma.assessmentControl.findMany();
		return res.map(toAssessmentControlEntity);
	}

	async update(id: number, data: UpdateAssessmentControlDto): Promise<AssessmentControlEntity> {
		try {
			const res = await this.prisma.assessmentControl.update({
				where: { id },
				data: data,
			});
			return toAssessmentControlEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new AssessmentControlNotFoundError(id);
			}
			throw error;
		}
	}

	async delete(id: number): Promise<void> {
		try {
			await this.prisma.assessmentControl.delete({
				where: { id },
			});
			return ;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new AssessmentControlNotFoundError(id);
			}
			throw error;
		}
	}
}
