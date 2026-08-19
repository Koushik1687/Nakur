const KEY_PATTERN = /^[a-zA-Z0-9-]{1,64}$/;

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key") || "";
  if (!KEY_PATTERN.test(key)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  const record = await useStorage("data").getItem<{
    mime: string;
    data: string;
  }>(`uploads/${key}`);

  if (!record?.data || !record.mime) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  return new Response(Buffer.from(record.data, "base64"), {
    headers: {
      "Content-Type": record.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});
