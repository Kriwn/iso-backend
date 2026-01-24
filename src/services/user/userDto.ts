import { userRole } from "../../../generated/prisma/enums";

export interface CreateUserDto {
	email: string;
	firstName: string;
	lastName: string;
	companyId?: number;
	role: userRole;
	image?: string | null;
}

export interface UpdateUserDto {
	firstName?: string;
	lastName?: string;
	companyId?: number;
	image?: string;
	role?: userRole;
}
