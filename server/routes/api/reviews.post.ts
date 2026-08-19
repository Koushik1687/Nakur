import { createReview } from "../../utils/store";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { authorName, authorInitials, rating, text, publishedAt, profilePhotoUrl, googleMapsUrl } = body;

  if (!authorName || !text || !rating) {
    throw createError({ statusCode: 400, message: "authorName, text, and rating are required." });
  }

  const review = await createReview({
    authorName,
    authorInitials: authorInitials || authorName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
    rating: Number(rating),
    text,
    publishedAt: publishedAt || new Date().toISOString(),
    profilePhotoUrl,
    googleMapsUrl,
  });

  return { review };
});
