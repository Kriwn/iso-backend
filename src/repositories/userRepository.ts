import { UserEntity } from "../entities/userEntity";
import { CreateUserDto, UpdateUserDto } from "../services/user/userdto";


export interface UserRepository {
	CreateUser(data: CreateUserDto): Promise<UserEntity>;
	UpdateUser(id: string,data: UpdateUserDto): Promise<UserEntity>;
	GetUserById(id: string): Promise<UserEntity | null>;
	GetAllUsers(): Promise<UserEntity[]>;
	DeleteUser(id: string): Promise<UserEntity>;
}
