import { Role } from "../../entities/userEntity";

export interface CreateUserDto {
	email: string;
	firstName: string;
	lastName: string;
	role: Role;
	image?: string | null;
}

export interface UpdateUserDto {
	firstName?: string;
	lastName?: string;
	image?: string;
	role?: Role;
}
