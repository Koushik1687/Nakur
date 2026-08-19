import { logoutAdmin } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  const header = getHeader(event, "authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  await logoutAdmin(token);
  return { ok: true };
});
