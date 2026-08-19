/**
 * Cross-platform Vercel build helper.
 *
 * 1. Copies Vite's dist/ output into Nitro's .vercel/output/static/
 *    (replaces the platform-dependent `cp -r dist/* .vercel/output/static/`)
 * 2. Patches Nitro's .vercel/output/config.json for SPA client-side routing.
 *
 * Usage:
 *   node scripts/vercel-build.mjs
 *
 * Prerequisites: run `npm run build:web` and `npm run build:api -- --preset vercel`
 * before this script.
 */

import { cpSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const distDir = resolve(root, "dist");
const staticDir = resolve(root, ".vercel/output/static");
const configPath = resolve(root, ".vercel/output/config.json");

// ── Step 1: Copy dist/ → .vercel/output/static/ ─────────────────────────────

if (!existsSync(distDir)) {
  console.error("[vercel-build] dist/ not found. Run build:web first.");
  process.exit(1);
}

mkdirSync(staticDir, { recursive: true });

cpSync(distDir, staticDir, { recursive: true });
console.log("[vercel-build] Copied dist/ → .vercel/output/static/");

// ── Step 2: Patch config.json for SPA routing ────────────────────────────────

if (!existsSync(configPath)) {
  console.warn("[vercel-build] .vercel/output/config.json not found — skipping SPA patch.");
  process.exit(0);
}

const config = JSON.parse(readFileSync(configPath, "utf8"));

if (!Array.isArray(config.routes)) {
  config.routes = [];
}

// Remove Nitro's catch-all and root API route.
// `/` must be served by the React SPA, not Nitro's API health endpoint.
config.routes = config.routes.filter(
  (r) =>
    !(
      (r.src === "/(.*)" && r.dest === "/__fallback") ||
      (r.src === "/" && r.dest === "/index")
    )
);

// Remove ALL "handle": "filesystem" entries — we'll add one back at the end.
config.routes = config.routes.filter((r) => r.handle !== "filesystem");

// Append: API catch-all → Nitro server, filesystem handler, then SPA fallback.
// API routes MUST reach the __fallback server function before the filesystem
// handler tries (and fails) to serve them as static files.
config.routes.push(
  { src: "/api/(.*)", dest: "/__fallback" },
  { handle: "filesystem" },
  { src: "/(.*)", dest: "/index.html" }
);

writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
console.log("[vercel-build] SPA fallback route added to", configPath);
