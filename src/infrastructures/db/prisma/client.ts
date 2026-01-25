import { logger } from "../../../config/logger";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../../generated/prisma/client";
import { Env } from "../../../config";

let prisma: PrismaClient | null = null;

export function getPrismaClient(env: Env) {
  if (prisma) return prisma;

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter,
    log: ["error", "info", "warn"],
  });

  prisma.$connect()
    .then(() => logger.info("Connected to PostgreSQL via Prisma"))
    .catch((err: unknown) => {
      logger.error("Prisma connection failed", { err });
      process.exit(1);
    });

  return prisma;
}
