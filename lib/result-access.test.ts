import { afterEach, describe, expect, it } from "vitest";
import { createResultAccessToken, verifyResultAccessToken } from "@/lib/result-access";

const originalSecret = process.env.RESULT_ACCESS_SECRET;

afterEach(() => {
  process.env.RESULT_ACCESS_SECRET = originalSecret;
});

describe("result access tokens", () => {
  it("accepts only a valid token for the requested scan", () => {
    process.env.RESULT_ACCESS_SECRET = "a-secure-test-secret-with-more-than-32-characters";
    const token = createResultAccessToken("scan-a");

    expect(verifyResultAccessToken("scan-a", token)).toBe(true);
    expect(verifyResultAccessToken("scan-b", token)).toBe(false);
    expect(verifyResultAccessToken("scan-a", "invalid-token")).toBe(false);
    expect(verifyResultAccessToken("scan-a", undefined)).toBe(false);
  });

  it("fails closed when the secret is missing or too short", () => {
    delete process.env.RESULT_ACCESS_SECRET;
    expect(() => createResultAccessToken("scan-a")).toThrow("RESULT_ACCESS_SECRET");

    process.env.RESULT_ACCESS_SECRET = "too-short";
    expect(() => createResultAccessToken("scan-a")).toThrow("RESULT_ACCESS_SECRET");
  });
});
