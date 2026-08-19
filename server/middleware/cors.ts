import { defineEventHandler, handleCors } from "h3";

/**
 * Nitro's `routeRules.cors` only appends `access-control-*` headers to
 * responses; it does not intercept the OPTIONS preflight that browsers send
 * before cross-origin requests with a JSON body or custom headers. That
 * preflight falls through to the route router, which rejects `OPTIONS` with
 * 405, and the browser blocks the request.
 *
 * This middleware answers preflight requests for the API with a 204 and the
 * CORS headers the frontend needs.
 */
export default defineEventHandler((event) => {
  if (!event.path.startsWith("/api/")) {
    return;
  }
  handleCors(event, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  });
});
