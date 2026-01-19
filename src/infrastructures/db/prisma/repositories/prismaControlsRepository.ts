import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { ControlEntity } from "../../../../entities/ControlsEntity";
import { ControlNotFoundError } from "../../../../errors/ControlsError";
import { ControlsRepository } from "../../../../repositories/ControlsRepository";
import { CreateControlDto } from "../../../../services/Controls/ControlsDto";

export class PrismaControlsRepository  implements ControlsRepository {
	constructor(private prisma: PrismaClient) {}

	async create(data: CreateControlDto): Promise<ControlEntity> {
		try {
			const  res = await this.prisma.controls.create({ data });
			return res as ControlEntity;
		} catch (error) {
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

	async delete(id: number): Promise<ControlEntity> {
		try {
			const res = await this.prisma.controls.delete({
				where: { id },
			});
			return res as ControlEntity;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new ControlNotFoundError(id);
			}
			throw error;
		}
	}
}
