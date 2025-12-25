let isDev = true;

export function initLogger(nodeEnv: string) {
	isDev = nodeEnv === "development";
}

function formatMessage(level: string, message: string, meta?: Record<string, any>) {
	if (isDev) {
		const color =
			level === "error" ? "\x1b[31m" :
				level === "warn" ? "\x1b[33m" :
					"\x1b[32m"; // info = green

		return `${color}[${level.toUpperCase()}]\x1b[0m ${message} ${meta ? JSON.stringify(meta) : ""
			}`;
	}

	// production = JSON log
	return JSON.stringify({
		level,
		message,
		...meta,
		timestamp: new Date().toISOString(),
	});
}

export const logger = {
	info: (message: string, meta?: Record<string, any>) =>
		console.log(formatMessage("info", message, meta)),

	warn: (message: string, meta?: Record<string, any>) =>
		console.warn(formatMessage("warn", message, meta)),

	error: (message: string, meta?: Record<string, any>) =>
		console.error(formatMessage("error", message, meta)),
};
