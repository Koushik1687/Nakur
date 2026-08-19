import { loginAdmin } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const password = body?.password ? String(body.password) : "";
  const token = await loginAdmin(password);
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Invalid admin password.",
    });
  }
  return { token };
});
