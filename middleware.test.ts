import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

const originalUsername = process.env.ADMIN_USERNAME;
const originalPassword = process.env.ADMIN_PASSWORD;

afterEach(() => {
  process.env.ADMIN_USERNAME = originalUsername;
  process.env.ADMIN_PASSWORD = originalPassword;
});

function request(credentials?: string) {
  const headers = credentials
    ? { authorization: `Basic ${Buffer.from(credentials).toString("base64")}` }
    : undefined;
  return new NextRequest("http://localhost/admin/scans", { headers });
}

describe("admin middleware", () => {
  it("fails closed when credentials are not configured", () => {
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD;
    expect(middleware(request()).status).toBe(503);
  });

  it("requires authentication", () => {
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "secret";
    const response = middleware(request());
    expect(response.status).toBe(401);
    expect(response.headers.get("www-authenticate")).toContain("Basic");
  });

  it("rejects invalid credentials and accepts valid credentials", () => {
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "secret";
    expect(middleware(request("admin:wrong")).status).toBe(401);
    expect(middleware(request("admin:secret")).status).toBe(200);
  });
});
