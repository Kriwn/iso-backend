import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export function getAuth(prisma: any) {
    return betterAuth({
        database: prismaAdapter(prisma, {
            provider: "postgresql",
        }),
        emailAndPassword: {
            enabled: true,
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
