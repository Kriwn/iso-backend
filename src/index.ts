import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { initLogger, logger } from "./config/logger";
import { loadEnv } from "./config/env";
import { CreateRedisClient } from "./infrastructures/db/redis/client";
import { RabbitmqService } from "./infrastructures/messaging/rabbitmq/rabbitmqService";
import { connectRabbit } from "./infrastructures/messaging/rabbitmq/client";
import { getPrismaClient } from "./infrastructures/db/prisma/client";
import { RedisService } from "./infrastructures/db/redis/redisService";
import { z } from "zod";
import { getAuth } from "./utils/auth";
import { PrismaUserRepository } from "./infrastructures/db/prisma/repositories/prismaUserRepositoty";
import { UserService } from "./services/user/userService";
import swagger from "@elysiajs/swagger";
import { userController } from "./interfaces/userController";

const app = new Elysia({
  // normalize: false,
  aot: true,
});

const env = loadEnv(app);
initLogger(env.NODE_ENV);
logger.info("Init Env");
const redis = CreateRedisClient(env);
let rabbitmqService: RabbitmqService | null = null;
const { connection, channel } = await connectRabbit(env);
const prisma = getPrismaClient();
const userRepo = new PrismaUserRepository(prisma);
const userService = new UserService(userRepo);

app.use(swagger({ path: "/docs" }))
  .use(userController(userService))


if (!connection || !channel) {
  logger.error("RabbitMQ not initialized");
} else {
  rabbitmqService = new RabbitmqService(connection, channel);

  await rabbitmqService.consumeFromQueue<{ message: string; at: string }>(
    "test.queue",
    async (data, raw) => {
      logger.info("RabbitMQ test consumer received message", {
        data,
        fields: raw.fields,
      });
    }
  );
}

const redisService = new RedisService(redis);



// Cors
app.use(
  cors({
    origin: true, // If set to true, Access-Control-Allow-Origin will be set to * (any origins)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 5, //defualt value
  })
)
app
  .get("/redis-test", async () => {
    const Message = z.object({
      message: z.string(),
    });

    await redisService.saveCache("test", { message: "Hello, Redis!" }, 1200);
    const data = await redisService.getCache("test", Message);

    if (!data) {
      logger.warn("No data found or failed to parse.");
      return { ok: false };
    }

    logger.info("Retrieved from Redis:", data);
    return { ok: true, data };
  })
  .get("/", () => "Hello Elysia")
  .get("/rabbitmq-test", async () => {
    if (!rabbitmqService) {
      logger.error("RabbitMQ service not available");
      return {
        ok: false,
        error: "RabbitMQ not initialized",
      };
    }

    const payload = {
      message: "Hello, RabbitMQ!",
      at: new Date().toISOString(),
    };

    // ส่งเข้า queue test.queue
    await rabbitmqService.publishJson("test.queue", payload);

    logger.info("RabbitMQ test message published", payload);

    return {
      ok: true,
      sent: payload,
    };
  })
  .listen(env.APP_PORT);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
