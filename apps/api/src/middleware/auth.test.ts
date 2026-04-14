import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

// Mock environment before imports
beforeAll(() => {
  vi.stubEnv("SUPABASE_URL", "https://test.supabase.co");
  vi.stubEnv("SUPABASE_ANON_KEY", "test-anon-key");
});

// Mock the supabase module
vi.mock("../lib/supabase.js", () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    }
  },
  createUserSupabaseClient: vi.fn(() => ({}))
}));

const { requireAuth } = await import("./auth.js");
const { supabase } = await import("../lib/supabase.js");

describe("requireAuth middleware", () => {
  it("should accept Authorization header with Bearer token", async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: { id: "test-user-id", email: "test@example.com" } },
      error: null
    } as any);

    const req = {
      headers: { authorization: "Bearer test-token-123" },
      authUser: undefined,
      supabase: undefined
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(supabase.auth.getUser).toHaveBeenCalledWith("test-token-123");
    expect(req.authUser).toBeDefined();
    expect(req.authUser?.id).toBe("test-user-id");
    expect(next).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should reject request without Authorization header", async () => {
    const req = {
      headers: {},
      authUser: undefined,
      supabase: undefined
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: "Missing bearer token"
      })
    );
  });

  it("should reject misspelled Authorisation header", async () => {
    const req = {
      headers: { authorisation: "Bearer test-token-123" },
      authUser: undefined,
      supabase: undefined
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: "Missing bearer token"
      })
    );
  });
});
