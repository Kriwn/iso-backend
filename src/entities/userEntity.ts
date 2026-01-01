import { User } from "../../generated/prisma/client";

export type Role = "ADMIN" | "INTERNAL_EXPERT" | "EXTERNAL_EXPERT";

export interface UserEntity {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: Role;
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserPrivateInfo {
  id: string;
  role: Role;
  isEmailVerified: boolean;
}

export function toUserEntity(user: User): UserEntity {
	return {
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
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
