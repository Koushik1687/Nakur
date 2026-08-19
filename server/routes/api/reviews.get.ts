import { listReviews } from "../../utils/store";

export default defineEventHandler(async () => {
  const reviews = await listReviews();
  return { reviews };
});
