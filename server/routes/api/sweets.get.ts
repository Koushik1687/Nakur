import { listSweets } from "../../utils/store";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let sweets = await listSweets();

  if (query.category) {
    const cat = String(query.category);
    sweets = sweets.filter((s) => s.category === cat);
  }
  if (query.featured === "true") {
    sweets = sweets.filter((s) => s.featured);
  }
  if (query.inStock === "true") {
    sweets = sweets.filter((s) => s.inStock);
  }

  return { sweets };
});
