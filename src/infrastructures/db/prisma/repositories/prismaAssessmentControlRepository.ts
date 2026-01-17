import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { AssessmentControlEntity, toAssessmentControlEntity } from "../../../../entities/AssessmentControlEntity";
import { AssessmentControlNotFoundError } from "../../../../errors/AssessmentControlError";
import { AssessmentControlRepository } from "../../../../repositories/AssessmentControlRepository";
import { CreateAssessmentControlDto, UpdateAssessmentControlDto } from "../../../../services/AssessmentControl/AssessmentControlDto";

export class PrismaIsoAssessmentControlRepository implements AssessmentControlRepository {
	constructor(private prisma: PrismaClient) {}

	async create(data: CreateAssessmentControlDto): Promise<AssessmentControlEntity> {
		try {
			const res = await this.prisma.assessmentControl.create({ data });
			return toAssessmentControlEntity(res);
		} catch (error) {
			throw error;
		}
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

	async delete(id: number): Promise<AssessmentControlEntity> {
		try {
			const res = await this.prisma.assessmentControl.delete({
				where: { id },
			});
			return toAssessmentControlEntity(res)
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new AssessmentControlNotFoundError(id);
			}
			throw error;
		}
	}
}
