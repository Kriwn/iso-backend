import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { ControlEntity, toControlEntity } from "../../../../entities/controlsEntity";
import { ControlCodeAlreadyExistsError, ControlCodeIdMismatchError, ControlNotFoundError } from "../../../../errors/controlsError";
import { ControlsRepository } from "../../../../repositories/controlsRepository";
import { CreateControlDto } from "../../../../services/controls/controlsDto";

export class PrismaControlsRepository  implements ControlsRepository {
	constructor(private prisma: PrismaClient) {}

	async create(data: CreateControlDto): Promise<ControlEntity> {
		try {
			const  res = await this.prisma.controls.create({ data });
			return toControlEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
			{
				throw new ControlCodeAlreadyExistsError(data.code, data.assessmentControlId);
			}
			throw error;
		}
	}

	async getById(id: number): Promise<ControlEntity | null> {
		const res = await this.prisma.controls.findUnique({
			where: { id },
		});
		if (!res) {
			throw new ControlNotFoundError(id);
		}
		return toControlEntity(res);
	}

	async getByCodeIso(code: string, assessmentControlId: number): Promise<ControlEntity | null> {
		const res = await this.prisma.controls.findFirst({
			where: { code, assessmentControlId },
		});
		if (!res) {
			throw new ControlCodeIdMismatchError(code, assessmentControlId);
		}
		return toControlEntity(res);
	}

	async getAll(): Promise<ControlEntity[]> {
		const res = await this.prisma.controls.findMany();
		return res.map(toControlEntity);
	}

	async update(id: number, data: any): Promise<ControlEntity> {
		try {
			const res = await this.prisma.controls.update({
				where: { id },
				data: data,
			});
			return toControlEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new ControlNotFoundError(id);
			}
			throw error;
		}
	}

	async delete(id: number): Promise<void> {
		try {
			await this.prisma.controls.delete({
				where: { id },
			});
			return ;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new ControlNotFoundError(id);
			}
			throw error;
		}
	}
}
