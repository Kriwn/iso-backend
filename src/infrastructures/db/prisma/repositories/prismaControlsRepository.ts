import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { ControlEntity } from "../../../../entities/controlsEntity";
import { ControlCodeAlreadyExistsError, ControlNotFoundError } from "../../../../errors/controlsError";
import { ControlsRepository } from "../../../../repositories/controlsRepository";
import { CreateControlDto } from "../../../../services/controls/controlsDto";

export class PrismaControlsRepository  implements ControlsRepository {
	constructor(private prisma: PrismaClient) {}

	async create(data: CreateControlDto): Promise<ControlEntity> {
		try {
			const  res = await this.prisma.controls.create({ data });
			return res as ControlEntity;
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
		return res as ControlEntity | null;
	}

	async getAll(): Promise<ControlEntity[]> {
		const res = await this.prisma.controls.findMany();
		return res as ControlEntity[];
	}

	async update(id: number, data: any): Promise<ControlEntity> {
		try {
			const res = await this.prisma.controls.update({
				where: { id },
				data: data,
			});
			return res as ControlEntity;
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
