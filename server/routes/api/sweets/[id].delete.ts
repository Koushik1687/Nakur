import { deleteSweet } from "../../../utils/store";
import { requireAdmin } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id")!;
  const ok = await deleteSweet(id);
  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }
  setResponseStatus(event, 204);
  return null;
});
