import cors from "cors";
import express from "express";
import helmet from "helmet";
import { logger } from "./config/logger.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { goalsRouter } from "./modules/goals/routes.js";
import { contributionsRouter } from "./modules/contributions/routes.js";
import { projectionsRouter } from "./modules/projections/routes.js";

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use((req, _res, next) => {
    logger.debug({ method: req.method, path: req.path }, "Incoming request");
    next();
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", requireAuth);
  app.use("/api/goals", goalsRouter);
  app.use("/api", contributionsRouter);
  app.use("/api", projectionsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
