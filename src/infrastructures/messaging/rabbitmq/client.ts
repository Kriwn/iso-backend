import { connect, Connection, Channel } from "amqplib";
import { logger } from "../../../config/logger";
import type { Env } from "../../../config/env";

let connection: any | null = null;
let channel: any | null = null;
const maxLog = 5;
let logCount = 0;

async function connectRabbitLoop(env: Env): Promise<void> {
	const url = env.RABBITMQ_URL;
	let attempt = 0;

	while (true) {
		try {
			if (logCount < maxLog) {
				logger.info(`RabbitMQ connect attempt ${attempt + 1}`);
			}
			const conn = await connect(url);
			const ch = await conn.createChannel();

			connection = conn;
			channel = ch;

			logCount = 0;
			logger.info("Connected to RabbitMQ");
			await channel.assertQueue("predict.request", { durable: true });
			await channel.assertQueue("predict.response", { durable: true });
			await channel.assertQueue("test.queue", { durable: true });
			logger.info("RabbitMQ channels and queues are set up");

			connection.on("error", (err: Error) => {
					logger.error("RabbitMQ connection error", { err });
			});

			connection.on("close", () => {
				logger.warn("RabbitMQ connection closed");
				connection = null;
				channel = null;
				void connectRabbitLoop(env);
			});
			return;
		} catch (error) {
			if (logCount < maxLog) {
				logger.error(`RabbitMQ connection attempt ${attempt} failed`, { error });
				logCount++;

				if (logCount === maxLog) {
					logger.error("RabbitMQ: suppressing further errors...");
				}
			}
		}
		attempt++;
		const delay = Math.min(attempt * 1000, 3000);
		await new Promise((resolve) => setTimeout(resolve, delay));
	}

}

export async function connectRabbit(
	env: Env
): Promise<{ connection: Connection | null; channel: Channel | null }> {

	if (connection && channel) {
		return { connection, channel };
	}

	await connectRabbitLoop(env);

	if (!connection || !channel) {
		return { connection: null, channel: null };
	}

	return { connection, channel };

}
