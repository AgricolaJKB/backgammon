import { eq } from "drizzle-orm";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
import jwt from "jsonwebtoken";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const PRIVATE_KEY = "my-private-key";

export const sessionCookieName = "AuthorizationToken";

export function generateJWT(data) {
  return jwt.sign(data, PRIVATE_KEY);
}

export function validateJWT(token) {
  try {
    jwt.verify(token, PRIVATE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function decodeJWT(token) {
  return jwt.decode(token);
}

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 * @param {string} token
 * @param {Date} expiresAt
 */
export function setSessionTokenCookie(event, token, expiresAt) {
  event.cookies.set(sessionCookieName, token, {
    expires: expiresAt,
    path: "/"
  });
}

/** @param {import("@sveltejs/kit").RequestEvent} event */
export function deleteSessionTokenCookie(event) {
  event.cookies.delete(sessionCookieName, {
    path: "/"
  });
}
