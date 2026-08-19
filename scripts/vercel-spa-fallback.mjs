/**
 * Post-build script: patches Nitro's .vercel/output/config.json so that
 * non-API, non-asset paths fall back to index.html (SPA client-side routing).
 *
 * Nitro generates a catch-all `(.*) → /__fallback` route that sends every
 * unmatched path to the Nitro serverless function.  That breaks client-side
 * routing because visiting e.g. /shop hits the Nitro server instead of
 * serving the Vite-built index.html.
 *
 * This script replaces that catch-all with the standard Vercel SPA pattern:
 *
 *   1. handle: "filesystem"  — serve static assets from .vercel/output/static/
 *   2. API route matches      — route to the Nitro serverless function
 *   3. catch-all              — serve index.html for the React Router
 */

import { readFileSync, writeFileSync } from "node:fs";

const configPath = ".vercel/output/config.json";

let config;
try {
  config = JSON.parse(readFileSync(configPath, "utf8"));
} catch {
  console.error(`[vercel-spa-fallback] ${configPath} not found — skipping.`);
  process.exit(0);
}

if (!Array.isArray(config.routes)) {
  config.routes = [];
}

// 1. Remove Nitro's catch-all that routes everything to /__fallback.
config.routes = config.routes.filter(
  (r) => !(r.src === "/(.*)" && r.dest === "/__fallback")
);

// 2. Remove ALL "handle": "filesystem" entries — we'll add one back at the end.
config.routes = config.routes.filter((r) => r.handle !== "filesystem");

// 3. Append: filesystem handler first, then SPA fallback.
config.routes.push(
  { handle: "filesystem" },
  { src: "/(.*)", dest: "/index.html" }
);

writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
console.log("[vercel-spa-fallback] SPA fallback route added to", configPath);
