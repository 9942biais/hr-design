import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_CONTEXT = "designer-inbody-result";

function getSecret() {
  const secret = process.env.RESULT_ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("RESULT_ACCESS_SECRET must be at least 32 characters long.");
  }
  return secret;
}

export function createResultAccessToken(scanId: string) {
  return createHmac("sha256", getSecret())
    .update(`${TOKEN_CONTEXT}:${scanId}`)
    .digest("base64url");
}

export function verifyResultAccessToken(scanId: string, token: string | undefined) {
  if (!token) return false;

  const expected = Buffer.from(createResultAccessToken(scanId));
  const provided = Buffer.from(token);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}
