import createHttpError from "http-errors";
import type { NextFunction, Request, Response } from "express";
import { createUserSupabaseClient, supabase } from "../lib/supabase.js";

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }
  return token;
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return next(createHttpError(401, "Missing bearer token"));
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return next(createHttpError(401, "Invalid authentication token"));
  }

  req.authUser = data.user;
  req.supabase = createUserSupabaseClient(token);
  next();
}
