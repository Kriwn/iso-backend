 import { getPrismaClient } from "../../infrastructures/db/prisma/client";
import { UserRepository } from "../../repositories/userRepository";
import { getAuth } from "../../utils/auth";
import { CreateUserDto, UpdateUserDto } from "./userDto"

export class UserService {
	private prisma;
	private auth;

	constructor(
		private userRepository: UserRepository,
		prisma = getPrismaClient()
	) {
		this.prisma = prisma;
		this.auth = getAuth(this.prisma);
	}

	async registerUser(data: CreateUserDto) {
		return this.userRepository.create(data);
	}

	async signInEmail(data: { email: string; password: string }) {
		const response = await this.auth.api.signInEmail({
			body: {
				email: data.email,
				password: data.password
			},
			asResponse: true // returns a response object instead of data
		});

		return response
	}

	async updateUser(id: string, data: UpdateUserDto) {
		return this.userRepository.update(id, data);
	}

	async getUserById(id: string) {
		return this.userRepository.getById(id);
	}

	async getAllUsers() {
		return this.userRepository.getAll();
	}

	async deleteUser(id: string) {
		return this.userRepository.delete(id);
	}
}
