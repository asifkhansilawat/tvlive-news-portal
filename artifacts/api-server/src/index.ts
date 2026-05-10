import app from "./app";
import { logger } from "./lib/logger";

// PORT defaults to 3001 if not set (Vercel serverless doesn't use this)
const port = Number(process.env["PORT"]) || 3001;

if (Number.isNaN(port) || port <= 0) {
  logger.error({ port: process.env["PORT"] }, "Invalid PORT value");
  process.exit(1);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
