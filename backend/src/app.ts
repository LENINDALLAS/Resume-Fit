import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ErrorCode } from "@resume-fit/shared";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { requestIdMiddleware } from "./middleware/requestIdMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(requestIdMiddleware);
  app.use(
    cors({
      origin: [env.DASHBOARD_ORIGIN, env.EXTENSION_ORIGIN],
      credentials: false,
    }),
  );
  app.use(express.json());

  app.use("/api/v1", apiRouter);

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: { code: ErrorCode.NOT_FOUND, message: "Resource not found." },
    });
  });

  app.use(errorMiddleware);

  return app;
}
