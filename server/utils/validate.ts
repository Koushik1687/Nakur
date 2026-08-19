import { SWEET_SHAPES, type SweetInput } from "./types";

export function parseSweetBody(body: any): SweetInput {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body.");
  }

  const name = String(body.name ?? "").trim();
  const description = String(body.description ?? "").trim();
  const category = String(body.category ?? "").trim();
  const shape = String(body.shape ?? "");
  const color = String(body.color ?? "#d9a441").trim();
  const price = Number(body.price);
  const bestBeforeHours = Number(body.bestBeforeHours ?? 48);
  const inStock = body.inStock !== false;
  const featured = body.featured === true;
  const imageUrl =
    body.imageUrl == null || body.imageUrl === ""
      ? undefined
      : String(body.imageUrl).trim();

  if (!name) throw new Error("name is required.");
  if (!description) throw new Error("description is required.");
  if (!category) throw new Error("category is required.");
  if (!SWEET_SHAPES.includes(shape as any)) {
    throw new Error(`shape must be one of: ${SWEET_SHAPES.join(", ")}.`);
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("price must be a non-negative number.");
  }
  if (!Number.isFinite(bestBeforeHours) || bestBeforeHours < 1) {
    throw new Error("bestBeforeHours must be a positive number.");
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
    throw new Error("color must be a hex value like #d9a441.");
  }
  if (imageUrl && !/^(https?:\/\/|\/)/i.test(imageUrl)) {
    throw new Error("imageUrl must be a relative path or an http(s) URL.");
  }
  if (imageUrl && imageUrl.length > 2048) {
    throw new Error("imageUrl is too long.");
  }

  return {
    name,
    description,
    category,
    shape: shape as SweetInput["shape"],
    color,
    imageUrl,
    price,
    bestBeforeHours,
    inStock,
    featured,
  };
}

export function partialSweetBody(body: any): Partial<SweetInput> {
  const out: Partial<SweetInput> = {};
  if (body.name !== undefined) out.name = String(body.name).trim();
  if (body.description !== undefined)
    out.description = String(body.description).trim();
  if (body.category !== undefined) out.category = String(body.category).trim();
  if (body.shape !== undefined) {
    if (!SWEET_SHAPES.includes(body.shape)) {
      throw new Error(`shape must be one of: ${SWEET_SHAPES.join(", ")}.`);
    }
    out.shape = body.shape;
  }
  if (body.color !== undefined) {
    if (!/^#[0-9a-fA-F]{6}$/.test(String(body.color))) {
      throw new Error("color must be a hex value like #d9a441.");
    }
    out.color = String(body.color);
  }
  if (body.price !== undefined) {
    const p = Number(body.price);
    if (!Number.isFinite(p) || p < 0) {
      throw new Error("price must be a non-negative number.");
    }
    out.price = p;
  }
  if (body.bestBeforeHours !== undefined) {
    const bbh = Number(body.bestBeforeHours);
    if (!Number.isFinite(bbh) || bbh < 1) {
      throw new Error("bestBeforeHours must be a positive number.");
    }
    out.bestBeforeHours = bbh;
  }
  if (body.inStock !== undefined) out.inStock = Boolean(body.inStock);
  if (body.featured !== undefined) out.featured = Boolean(body.featured);
  if (body.imageUrl !== undefined) {
    // Empty string clears the photo.
    out.imageUrl =
      body.imageUrl === "" ? undefined : String(body.imageUrl).trim();
    if (
      out.imageUrl &&
      !/^(https?:\/\/|\/)/i.test(out.imageUrl)
    ) {
      throw new Error("imageUrl must be a relative path or an http(s) URL.");
    }
    if (out.imageUrl && out.imageUrl.length > 2048) {
      throw new Error("imageUrl is too long.");
    }
  }
  return out;
}
