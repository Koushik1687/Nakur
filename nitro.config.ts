import { defineNitroConfig } from "nitropack/config";

/**
 * The backend is written as Nitro + h3 route handlers, which Nitro compiles
 * into serverless functions for any host:
 *
 *   npm run build              # local Node server (default)
 *   npm run build:vercel       # Vercel Functions
 *   npm run build:netlify      # Netlify Functions
 *   npm run build:cloudflare   # Cloudflare Pages Functions
 *   npm run build:aws          # AWS Lambda
 *
 * The `data` storage mount is what the catalogue + admin sessions persist to.
 * Swap the driver per platform (see comments below) — the route code is
 * identical across all of them.
 */
export default defineNitroConfig({
  // `nitro build --preset <x>` overrides this; omitted => local node-server.
  preset: (process.env.NITRO_PRESET as any) || undefined,

  compatibilityDate: "2026-08-18",

  // Server source (routes/middleware/utils) lives in ./server, so point
  // srcDir there — Nitro scans api/, routes/, middleware/ inside it.
  srcDir: "./server",

  storage: {
    // Local/dev: filesystem. In serverless, set DATA_DIR (e.g. /tmp/data on
    // Vercel/Lambda) or switch the driver via NITRO_STORAGE_DRIVER:
    //   vercel     -> driver: 'vercel-kv'     (with KV_REST_API_URL / KV_REST_API_TOKEN)
    //   netlify    -> driver: 'netlify-blob'
    //   cloudflare -> driver: 'cloudflare-kv' (with a KV namespace binding)
    //   aws        -> driver: 's3'            (with S3 credentials)
    data: {
      driver: (process.env.NITRO_STORAGE_DRIVER as any) || "fs",
      base: process.env.DATA_DIR || "./server/.data",
    },
  },
});
