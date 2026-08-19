import { getHeader, createError } from "h3";
import { randomUUID } from "node:crypto";

/**
 * Admin sessions are persisted in Nitro storage (the `data` mount) so a token
 * stays valid across serverless invocations / cold starts, instead of living
 * only in process memory. The session list is a JSON array of token strings.
 */
const TOKENS_KEY = "admin-tokens";

async function loadTokens(): Promise<string[]> {
  const raw = await useStorage("data").getItem<string[]>(TOKENS_KEY);
  return Array.isArray(raw) ? raw : [];
}

async function saveTokens(tokens: string[]): Promise<void> {
  await useStorage("data").setItem(TOKENS_KEY, tokens);
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "nakur-admin";
}

export async function loginAdmin(password: string): Promise<string | null> {
  if (!password || password !== adminPassword()) return null;
  const token = randomUUID();
  const tokens = await loadTokens();
  tokens.push(token);
  await saveTokens(tokens);
  return token;
}

export async function logoutAdmin(token: string): Promise<void> {
  const tokens = await loadTokens();
  await saveTokens(tokens.filter((t) => t !== token));
}

export async function requireAdmin(event: any): Promise<void> {
  const header = getHeader(event, "authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Admin authentication required.",
    });
  }
  const tokens = await loadTokens();
  if (!tokens.includes(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Invalid or expired admin session.",
    });
  }
}
