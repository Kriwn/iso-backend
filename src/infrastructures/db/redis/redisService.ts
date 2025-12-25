import type { RedisClientType } from "redis";
import { z } from "zod";
import { logger } from "../../../config/logger";

export class RedisService {
	constructor(
		private redis: RedisClientType,
		private defaultTTL: number = 3600
	) {
		logger.info("RedisService initialized with default TTL:", { defaultTTL });
	}

	async saveCache(key: string, data: any, ttlSeconds?: number): Promise<boolean>{
		const value = JSON.stringify(data);
		const ttl = ttlSeconds ?? this.defaultTTL;
		try {
			await this.redis.set(key, value, {
				EX: ttl,
			});
			logger.info("Cache saved", { key, ttl });
			return true;
		}
		catch (error: any) {
			if (error.code === "ECONNREFUSED") {
				logger.error("Redis connection refused", { key });
			} else if (error.code === "NR_CLOSED") {
				logger.error("Redis connection closed unexpectedly", { key });
			} else {
				logger.error("Redis unexpected error", { error, key });
			}
			return false;
		}
	}

	async getCache<T>(key: string, schema: z.Schema<T>): Promise<T | null> {
		let data = null;
		try {
			data = await this.redis.get(key);
		}
		catch (error: any) {
			if (error.code === "ECONNREFUSED") {
				logger.error("Redis connection refused", { key });
			} else if (error.code === "NR_CLOSED") {
				logger.error("Redis connection closed unexpectedly", { key });
			} else {
				logger.error("Redis unexpected error", { error, key });
			}
			return null;
		}

		if (!data) {
			return null;
		}

		let json: unknown;
		try {
			json = JSON.parse(data);
		}
		catch (error) {
			logger.warn("Can not parse JSON from cache", { error, key });
			return null;
		}

		const parsed = schema.safeParse(json);
		if (!parsed.success) {
			logger.warn("Cannot parse cached data with schema", { key, error: parsed.error });
			return null;
		}
		return parsed.data;
	}
}
