import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { toUserEntity, UserEntity } from "../../../../entities/userEntity";
import { UserAlreadyExistsError, UserNotFoundError } from "../../../../errors/useError";
import { UserRepository } from "../../../../repositories/userRepository";
import { CreateUserDto, UpdateUserDto } from "../../../../services/user/userDto";

export class PrismaUserRepository implements UserRepository {

	constructor(private prisma: PrismaClient) {}

	async create(data: CreateUserDto): Promise<UserEntity> {
		try {
			const res = await this.prisma.user.create({ data });
			return toUserEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new UserAlreadyExistsError(data.email);
			}
			throw error;
		}
	}

	async update(id: string,data: UpdateUserDto): Promise<UserEntity> {
		try {
			const res = await this.prisma.user.update({
				where: { id },
				data: data,
			});
			return toUserEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				console.log('not found');
				throw new UserNotFoundError(id);
			}
			throw error;
		}
	}

	async getById(id: string): Promise<UserEntity | null> {
		const res = await this.prisma.user.findUnique({
			where: { id },
		});
		if (!res) {
			throw new UserNotFoundError(id);
		}
		return toUserEntity(res);
	}

	async getAll(): Promise<UserEntity[]> {
		const res = await this.prisma.user.findMany();
		return res.map(toUserEntity);
	}

	async delete(id: string): Promise<void> {
		try {
			await this.prisma.user.delete({
				where: { id },
			});
			return;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new UserNotFoundError(id);
			}
			throw error;
		}
	}
}
