import { Elysia, t } from "elysia";
import { env as elysiaEnv } from '@yolk-oss/elysia-env';


export const EnvSchema = {
	NODE_ENV: t.String({
		error: "NODE_ENV is required",
	}),

	REDIS_PASSWORD: t.String({
		error: "REDIS_PASSWORD is required",
	}),
	REDIS_PORT: t.String({
		error: "REDIS_PORT is required",
	}),

	REDIS_URL: t.String({
		error: "REDIS_URL is required",
	}),


	DATABASE_URL: t.String({
		error: "DATABASE_URL is required",
	}),

	JWT_SECRET: t.String({
		error: "JWT_SECRET is required",
	}),

	RABBITMQ_USER: t.String({
		error: "RABBITMQ_USER is required",
	}),

	RABBITMQ_PASSWORD: t.String({
		error: "RABBITMQ_PASSWORD is required",
	}),

	RABBITMQ_URL: t.String({
		error: "RABBITMQ_URL is required",
	}),



	// ---------------------- APP -------------------------------//
	APP_PORT: t.String({
		error: "APP_PORT is required",
	}),

	// BETTER_AUTH_SECRET: t.String({
	// 	error: "BETTER_AUTH_SECRET is required",
	// }),

	// BETTER_AUTH_URL: t.String({
	// 	error: "BETTER_AUTH_URL is required",
	// }),


	// GOOGLE_CLIENT_ID: t.String({
	// 	error: "GOOGLE_CLIENT_ID is required",
	// }),

	// GOOGLE_CLIENT_SECRET: t.String({
	// 	error: "GOOGLE_CLIENT_SECRET is required",
	// }),

	// LINE_CLIENT_ID: t.String({
	// 	error: "LINE_CLIENT_ID is required",
	// }),

	// LINE_CLIENT_SECRET: t.String({
	// 	error: "LINE_CLIENT_SECRET is required",
	// }),

	// FACEBOOK_CLIENT_ID: t.String({
	// 	error: "LINE_CLIENT_ID is required",
	// }),

	// FACEBOOK_CLIENT_SECRET: t.String({
	// 	error: "LINE_CLIENT_ID is required",
	// }),

};

export type Env = {
	NODE_ENV: string;
	REDIS_PASSWORD: string;
	REDIS_PORT: string;
	REDIS_URL: string;
	DATABASE_URL: string;
	JWT_SECRET: string;
	RABBITMQ_USER: string;
	RABBITMQ_PASSWORD: string;
	RABBITMQ_URL: string;

	// ---------------------- APP -------------------------------//

	APP_PORT: string;
	// BETTER_AUTH_SECRET: string;
	// BETTER_AUTH_URL: string;
	// GOOGLE_CLIENT_ID: string;
	// GOOGLE_CLIENT_SECRET: string;
	// LINE_CLIENT_ID: string;
	// LINE_CLIENT_SECRET: string;
	// FACEBOOK_CLIENT_ID: string;
	// FACEBOOK_CLIENT_SECRET: string;
};


export function loadEnv(app: Elysia): Env {
	app.use(elysiaEnv(EnvSchema));

	return process.env as Env
}
