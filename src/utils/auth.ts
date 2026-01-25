import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Env } from "../config";

export function getAuth(prisma: any, env: Env) {
    return betterAuth({
        database: prismaAdapter(prisma, {
            provider: "postgresql",
        }),
        emailAndPassword: {
            enabled: true,
        },
        trustedOrigins: env.BETTER_AUTH_CORS ? env.BETTER_AUTH_CORS.split(",") : [],
        advanced: {
          crossSubDomainCookies: {
            enabled: true,
          },
          defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            httpOnly: true,
          },
        },
        user: {
            modelName: "user",
            fields: {
                name: "firstName", // Map better-auth's "name" to your "firstName" field
            },
            additionalFields: {
                lastName: {
                    type: "string",
                    required: false,
                },
                role: {
                    type: "string",
                    required: false,
                },
            },
        },
        session: {
            modelName: "session",
        },
        account: {
            modelName: "account",
        },
        databaseHooks: {
            user: {
                create: {
                    before: async (user) => {
                        return {
                            data: {
                                ...user,
                                id: crypto.randomUUID(), // Override ID with UUID
                            },
                        };
                    },
                },
            },
        },
    });
}
