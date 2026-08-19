import { updateReview } from "../../../utils/store";
import { requireAdmin } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterParam(event, "id")!;
  const body = await readBody(event);
  const { authorName, authorInitials, rating, text, publishedAt, profilePhotoUrl, googleMapsUrl } = body;

  const patch: Record<string, unknown> = {};
  if (authorName !== undefined) patch.authorName = authorName;
  if (authorInitials !== undefined) patch.authorInitials = authorInitials;
  if (rating !== undefined) patch.rating = Number(rating);
  if (text !== undefined) patch.text = text;
  if (publishedAt !== undefined) patch.publishedAt = publishedAt;
  if (profilePhotoUrl !== undefined) patch.profilePhotoUrl = profilePhotoUrl;
  if (googleMapsUrl !== undefined) patch.googleMapsUrl = googleMapsUrl;

  const review = await updateReview(id, patch as any);
  if (!review) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }
  return { review };
});
