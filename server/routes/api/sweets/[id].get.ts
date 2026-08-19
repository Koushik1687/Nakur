import { getSweet } from "../../../utils/store";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")!;
  const sweet = await getSweet(id);
  if (!sweet) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }
  return { sweet };
});
