import { userRole } from "../../../generated/prisma/enums";

export interface CreateUserDto {
	email: string;
	firstName: string;
	lastName: string;
	role: userRole;
	image?: string | null;
}

export interface UpdateUserDto {
	firstName?: string;
	lastName?: string;
	image?: string;
	role?: userRole;
}
