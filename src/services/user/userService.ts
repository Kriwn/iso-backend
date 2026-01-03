import { UserRepository } from "../../repositories/userRepository";
import { CreateUserDto, UpdateUserDto } from "./userDto";


// TODO Implement business logic, validation, etc.
export class UserService {
	constructor(private userRepository: UserRepository) {}

	async registerUser(data: CreateUserDto) {
		return this.userRepository.createUser(data);
	}

	async updateUser(id: string, data: UpdateUserDto) {
		return this.userRepository.updateUser(id, data);
	}

	async getUserById(id: string) {
		return this.userRepository.getUserById(id);
	}

	async getAllUsers() {
		return this.userRepository.getAllUsers();
	}

	async deleteUser(id: string) {
		return this.userRepository.deleteUser(id);
	}
}
