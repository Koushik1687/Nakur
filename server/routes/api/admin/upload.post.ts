import { randomUUID } from "node:crypto";
import { readMultipartFormData } from "h3";
import { requireAdmin } from "../../../utils/auth";

/** Uploaded image size cap (5 MB). */
const MAX_BYTES = 5 * 1024 * 1024;

/** Image content types we accept. SVG is excluded (scriptable when served same-origin). */
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const parts = await readMultipartFormData(event);
  const file = parts?.find((p) => p.name === "file" && p.data?.length);
  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "No file provided.",
    });
  }

  const mime = String(file.type || "").toLowerCase();
  if (!ALLOWED_MIME.has(mime)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Only JPEG, PNG, WebP, GIF and AVIF images are allowed.",
    });
  }
  if (file.data.byteLength > MAX_BYTES) {
    throw createError({
      statusCode: 413,
      statusMessage: "Payload Too Large",
      message: "Image must be under 5 MB.",
    });
  }

  // Stored in the same `data` storage mount as the catalogue, so uploads work
  // on every platform driver (fs locally, KV/Blob/S3 in production). Base64 in
  // JSON keeps it portable across drivers.
  const key = randomUUID();
  await useStorage("data").setItem(`uploads/${key}`, {
    mime,
    data: Buffer.from(file.data).toString("base64"),
  });

  return { url: `/api/files/${key}` };
});
