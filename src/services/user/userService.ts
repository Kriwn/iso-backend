import { UserRepository } from "../../repositories/userRepository";
import { CreateUserDto, UpdateUserDto } from "./userdto";


// TODO Implement business logic, validation, etc.
export class UserService {
	constructor(private userRepository: UserRepository) {}

	async registerUser(data: CreateUserDto) {
		return this.userRepository.CreateUser(data);
	}

	async updateUser(id: string, data: UpdateUserDto) {
		return this.userRepository.UpdateUser(id, data);
	}

	async getUserById(id: string) {
		return this.userRepository.GetUserById(id);
	}

	async getAllUsers() {
		return this.userRepository.GetAllUsers();
	}

	async deleteUser(id: string) {
		return this.userRepository.DeleteUser(id);
	}
}
