import { createClient, RedisClientType } from "redis";
import { Env } from "../../../config/env";
import { logger } from "../../../config/logger";

let redisClient: RedisClientType | null = null;
let logCount = 0;
const maxLog = 5;


export function CreateRedisClient(env: Env): RedisClientType {
	if (redisClient) return redisClient;

	redisClient = createClient({
		url: env.REDIS_URL,
		password: env.REDIS_PASSWORD,

		socket: {
			reconnectStrategy(retries) {
				const delay = Math.min((retries + 1) * 1000, 3000);
				logCount++;
				if (logCount < maxLog) {
					logger.warn(`Redis reconnecting in ${delay}ms (retry #${retries})`);
				}
				if (logCount == maxLog) {
					logCount++;
					logger.warn("Reached max Redis reconnect logs. Further logs suppressed.");
				}
				return delay;
			}
		}

	});

	redisClient.on("ready", async () => {
		logger.info("Connected to Redis");
		logCount = 0;

		if (!redisClient) return;

		try {
			const info = await redisClient.info("server");
			const uptime = parseInt(info.match(/uptime_in_seconds:(\d+)/)?.[1] ?? "0");

			if (uptime < 10) {
				logger.warn("Redis seems freshly restarted — flushing cache...");
				await redisClient.flushAll();
				logger.info("Redis cache flushed.");
			}
		} catch (err) {
			logger.error("Failed to inspect Redis status", { err });
		}
	});

	redisClient.on("error", (err: Error) => {
			logger.error("Redis client error", { error: err });
	});


	redisClient.connect().catch(err => logger.error("Initial Redis connect failed", { err }));

	return redisClient;
}
