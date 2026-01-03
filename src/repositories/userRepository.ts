import { UserEntity } from "../entities/userEntity";
import { CreateUserDto, UpdateUserDto } from "../services/user/userDto";


export interface UserRepository {
	createUser(data: CreateUserDto): Promise<UserEntity>;

	getUserById(id: string): Promise<UserEntity | null>;
	getAllUsers(): Promise<UserEntity[]>;

	updateUser(id: string,data: UpdateUserDto): Promise<UserEntity>;
	
	deleteUser(id: string): Promise<UserEntity>;
}
