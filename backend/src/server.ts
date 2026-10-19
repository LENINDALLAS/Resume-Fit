import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { logger } from "./utils/logger.js";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Resume-Fit backend listening on port ${env.PORT}`, {
    env: env.NODE_ENV
  });
  logger.info(`GEMINI_MOCK_MODE is ${env.GEMINI_MOCK_MODE}`, {
    env: env.NODE_ENV
  });
});
