import { User, userRole } from "../../generated/prisma/client";


export interface UserEntity {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	companyId?: number | null;
	role: userRole;
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserPrivateInfo {
  id: string;
  role: userRole;
  isEmailVerified: boolean;
}

export function toUserEntity(user: User): UserEntity {
	return {
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		companyId: user.companyId ?? null,
		role: user.role,
		image: user.image,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
}

export function toUserPrivateInfo(user: User): UserPrivateInfo {
	return {
	id: user.id,
	role: user.role,
	isEmailVerified: user.emailVerified,
  };
}
