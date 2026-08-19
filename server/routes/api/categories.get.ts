import { listCategories } from "../../utils/store";

export default defineEventHandler(async () => {
  const categories = await listCategories();
  return { categories };
});
