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
    });
}
