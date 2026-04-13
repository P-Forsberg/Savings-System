import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";

interface HttpLikeError extends Error {
  status?: number;
  statusCode?: number;
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Route not found" });
}

export function errorHandler(err: HttpLikeError, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues
    });
  }

  const status = err.statusCode ?? err.status ?? 500;
  if (status >= 500) {
    logger.error({ err, path: req.path }, "Unhandled server error");
  }

  return res.status(status).json({
    error: status >= 500 ? "Internal server error" : err.message
  });
}
