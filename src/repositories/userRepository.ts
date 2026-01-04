import { UserEntity } from "../entities/userEntity";
import { CreateUserDto, UpdateUserDto } from "../services/user/userDto";


export interface UserRepository {
	create(data: CreateUserDto): Promise<UserEntity>;

	getById(id: string): Promise<UserEntity | null>;
	getAll(): Promise<UserEntity[]>;

	update(id: string,data: UpdateUserDto): Promise<UserEntity>;

	delete(id: string): Promise<UserEntity>;
}
