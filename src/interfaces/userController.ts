import { Elysia, t } from "elysia";
import { UserService } from "../services/user/userService";
import { UserAlreadyExistsError, UserNotFoundError } from "../errors/useError";
import { CreateUserDto, UpdateUserDto } from "../services/user/userDto";
import { userRole } from "../../generated/prisma/client";

const UserRoleEnum = {
  ADMIN: userRole.ADMIN,
  INTERNAL_EXPERT: userRole.INTERNAL_EXPERT,
  EXTERNAL_EXPERT: userRole.EXTERNAL_EXPERT,
} as const;

type UserRole =
  (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

export const userController = (userService: UserService) =>
	new Elysia({ prefix: "/api/users", tags: ["User"] })
		.post(
			"/",
			async ({ body, set }) => {
				try {
					const dto: CreateUserDto = {
						email: body.email,
						firstName: body.firstName,
						lastName: body.lastName,
						role: body.role,
						image: body.image,
					};
					const user = await userService.registerUser(dto);
					set.status = 201;
					return user;
				} catch (err) {
					if (err instanceof UserAlreadyExistsError) {
						set.status = 409;
						return { message: err.message };
					}
					else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Create user" },
				body: t.Object({
					email: t.String({ format: "email" }),
					firstName: t.String(),
					lastName: t.String(),
					role: t.Enum(UserRoleEnum),
					image: t.Optional(t.String({ format: "uri" })),
				},
				{ additionalProperties: false }
			),
			}
		)
		.get(
			"/:id",
			async ({ params, set }) => {
				try {
					return await userService.getUserById(params.id);
				} catch (err) {
					if (err instanceof UserNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					throw err;
				}
			},
			{
				detail: { summary: "Get user by id" },
				params: t.Object({ id: t.String() }),
			}
		)
		.get(
			"/",
			async () => {
				return await userService.getAllUsers();
			},
			{
				detail: { summary: "Get all users" },
			}
		)
		.patch(
			"/:id",
			async ({ params, body, set }) => {
				try {
					const dto: UpdateUserDto = {
						firstName: body.firstName,
						lastName: body.lastName,
						role: body.role,
						image: body.image,
					};
					return await userService.updateUser(params.id, dto);
				} catch (err) {
					if (err instanceof UserNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Update user by id" },
				params: t.Object({ id: t.String() }),
				body: t.Object({
					// email: t.Optional(t.String({ format: "email" })),
					firstName: t.Optional(t.String()),
					lastName: t.Optional(t.String()),
					role: t.Optional(t.Enum(UserRoleEnum)),
					image: t.Optional(t.String({ format: "uri" })),

				},
					{ additionalProperties: false }
				),

			}
		)
		.delete(
			"/:id",
			async ({ params, set }) => {
				try {
					await userService.deleteUser(params.id);
					set.status = 204;
					return;
				} catch (err) {
					if (err instanceof UserNotFoundError) {
						set.status = 404;
						return { message: err.message };
					}
					else {
						set.status = 500;
						return { message: "Internal Server Error" };
					}
				}
			},
			{
				detail: { summary: "Delete user by id" },
				params: t.Object({ id: t.String() }),
			}
		);
