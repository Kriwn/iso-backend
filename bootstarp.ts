// bootstrap.ts
import fs from "fs";

if (process.env.NODE_ENV === "production") {
	if (process.env.PG_SSL_CA) {
		fs.writeFileSync("/tmp/pg-ca.crt", process.env.PG_SSL_CA);
		process.env.NODE_EXTRA_CA_CERTS = "/tmp/pg-ca.crt";
	}
}
