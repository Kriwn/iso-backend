import amqp from "amqplib";
import { logger } from '../../../config/logger';


//TODO Crate interface for queue
export class RabbitmqService {
	private connection: amqp.Connection;
	private channel: amqp.Channel;

	constructor(connection: amqp.Connection, channel: amqp.Channel) {
		this.connection = connection;
		this.channel = channel;
	}

	async publishToQueue(queue: string, message: Buffer): Promise<void> {
		const ok = this.channel.sendToQueue(queue, message, { persistent: true });

		if (!ok) {
			logger.warn("RabbitMQ channel buffer full, waiting for 'drain' event");
			await new Promise<void>((resolve) => {
				this.channel.once("drain", () => resolve());
			});
		}
	}

	async publishJson(queue: string, data: unknown): Promise<void> {
		const buffer = Buffer.from(JSON.stringify(data));

		const ok = this.channel.sendToQueue(queue, buffer, { persistent: true })
		if (!ok) {
			logger.warn("RabbitMQ channel buffer full, waiting for 'drain' event");
			await new Promise<void>((resolve) => {
				this.channel.once("drain", () => resolve());
			});
		}
	}

	async consumeFromQueue<T>(
		queue: string,
		handler: (data: T, raw: amqp.ConsumeMessage) => Promise<void>
	): Promise<void> {
		await this.channel.consume(
			queue,
			async (msg) => {
				if (!msg) {
					logger.warn("Received null message from RabbitMQ");
					return;
				}

				try {
					const parsed = JSON.parse(msg.content.toString()) as T;
					await handler(parsed, msg);
					this.channel.ack(msg);
				} catch (error) {
					logger.error("Error processing RabbitMQ message", { error });
					this.channel.nack(msg, false, false);
				}
			},
			{ noAck: false }
		);
	}


}
