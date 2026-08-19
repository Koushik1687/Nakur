import { updateSweet } from "../../../utils/store";
import { partialSweetBody } from "../../../utils/validate";
import { requireAdmin } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id")!;
  const body = await readBody(event);
  try {
    const patch = partialSweetBody(body);
    const sweet = await updateSweet(id, patch);
    if (!sweet) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }
    return { sweet };
  } catch (err: any) {
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: err.message,
    });
  }
});
