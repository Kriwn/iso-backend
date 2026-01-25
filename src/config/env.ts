import { Elysia, t } from "elysia";
import { env as elysiaEnv } from '@yolk-oss/elysia-env';


export const EnvSchema = {
	NODE_ENV: t.String({
		error: "NODE_ENV is required",
	}),

	DATABASE_URL: t.String({
		error: "DATABASE_URL is required",
	}),

	// ---------------------- SWAGGER PROTECTION -------------------------------//
	SWAGGER_USERNAME: t.Optional(t.String()),
	SWAGGER_PASSWORD: t.Optional(t.String()),

	// ---------------------- APP -------------------------------//
	APP_PORT: t.String({
		error: "APP_PORT is required",
	}),

	LLM_API_KEY: t.String({
		error: "LLM_API_KEY is required",
	}),

	// LLM_BASE_URL: t.String({
		// error: "LLM_BASE_URL is required",
	// }),

	POST_LLM_PATH: t.String({
		error: "POST_LLM_PATH is required",
	}),

	// BETTER_AUTH_SECRET: t.String({
	// 	error: "BETTER_AUTH_SECRET is required",
	// }),

	BETTER_AUTH_URL: t.String({
		error: "BETTER_AUTH_URL is required",
	}),

	BETTER_AUTH_CORS: t.String({
		error: "BETTER_AUTH_CORS is required",
	}),


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
	DATABASE_URL: string;

	// ---------------------- SWAGGER PROTECTION -------------------------------//
	SWAGGER_USERNAME?: string;
	SWAGGER_PASSWORD?: string;

	// ---------------------- APP -------------------------------//

	APP_PORT: string;
	LLM_API_KEY: string;
	// LLM_BASE_URL: string;
	POST_LLM_PATH: string;
	// BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL: string;
	BETTER_AUTH_CORS: string;
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
