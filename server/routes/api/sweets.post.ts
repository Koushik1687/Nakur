import { createSweet } from "../../utils/store";
import { parseSweetBody } from "../../utils/validate";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const body = await readBody(event);
  try {
    const input = parseSweetBody(body);
    const sweet = await createSweet(input);
    setResponseStatus(event, 201);
    return { sweet };
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: err.message,
    });
  }
});
