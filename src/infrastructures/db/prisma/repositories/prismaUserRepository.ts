import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { toUserEntity, UserEntity } from "../../../../entities/userEntity";
import { UserAlreadyExistsError, UserNotFoundError } from "../../../../errors/useError";
import { UserRepository } from "../../../../repositories/userRepository";
import { CreateUserDto, UpdateUserDto } from "../../../../services/user/userDto";

export class PrismaUserRepository implements UserRepository {

	constructor(private prisma: PrismaClient) {}

	async createUser(data: CreateUserDto): Promise<UserEntity> {
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

	async updateUser(id: string,data: UpdateUserDto): Promise<UserEntity> {
		try {
			const res = await this.prisma.user.update({
				where: { id },
				data: data,
			});
			return toUserEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new UserNotFoundError(id);
			}
			// if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			// 	throw new UserAlreadyExistsError(data.email!);
			// }
			throw error;
		}
	}

	async getUserById(id: string): Promise<UserEntity | null> {
		const res = await this.prisma.user.findUnique({
			where: { id },
		});
		if (!res) {
			throw new UserNotFoundError(id);
		}
		return toUserEntity(res);
	}

	async getAllUsers(): Promise<UserEntity[]> {
		const res = await this.prisma.user.findMany();
		return res.map(toUserEntity);
	}

	async deleteUser(id: string): Promise<UserEntity> {
		try {
			const res = await this.prisma.user.delete({
				where: { id },
			});
			return toUserEntity(res);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new UserNotFoundError(id);
			}
			throw error;
		}
	}
}
