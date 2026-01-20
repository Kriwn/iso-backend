import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { EvidenceEntity, toEvidenceEntity } from "../../../../entities/evidenceEntity";
import { EvidenceAlreadyExistsError, EvidenceNotFoundError } from "../../../../errors/evidenceError";
import { EvidenceRepository } from "../../../../repositories/evidenceRepository";
import { createEvidenceDto, updateEvidenceDto } from "../../../../services/evidence/evidenceDto";

export class PrismaEvidenceRepository implements EvidenceRepository {
	constructor(private prisma: PrismaClient) { }

	async create(data: createEvidenceDto): Promise<EvidenceEntity> {
		try {
			const res = await this.prisma.evidence.create({ data });
			return toEvidenceEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new EvidenceAlreadyExistsError(data.fileName);
			}
			throw error;
		}
	}

	async update(id: number,data: updateEvidenceDto): Promise<EvidenceEntity> {
		try {
			const res = await this.prisma.evidence.update({
				where: { id: id },
				data: data,
			});
			return toEvidenceEntity(res);
		}
		catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new EvidenceNotFoundError(id);
			}
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new EvidenceAlreadyExistsError(data.fileName!);
			}
			throw error;
		}
	}

	async getById(id: number): Promise<EvidenceEntity | null> {
		const res = await this.prisma.evidence.findUnique({
			where: { id: id },
		});
		if (!res) {
			throw new EvidenceNotFoundError(id);
		}
		return toEvidenceEntity(res);
	}

	async getAll(): Promise<EvidenceEntity[]> {
		const res = await this.prisma.evidence.findMany();
		return res.map(toEvidenceEntity);
	}

	async getAllByControlId(controlId: number): Promise<EvidenceEntity[]> {
		const res = await this.prisma.evidence.findMany({
			where: { controlId: controlId },
		});
		return res.map(toEvidenceEntity);
	}

	async delete(id: number): Promise<void> {
		try {
			await this.prisma.evidence.delete({
				where: { id: id },
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new EvidenceNotFoundError(id);
			}
			throw error;
		}
	}
}
