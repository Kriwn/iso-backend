import { UserRepository } from "../../repositories/userRepository";
import { CreateUserDto, UpdateUserDto } from "./userDto";


// TODO Implement business logic, validation, etc.
export class UserService {
	constructor(private userRepository: UserRepository) {}

	async registerUser(data: CreateUserDto) {
		return this.userRepository.create(data);
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
