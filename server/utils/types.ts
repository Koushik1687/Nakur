export type SweetShape = "laddu" | "peda" | "barfi" | "gulabjamun" | "jalebi";

export interface Sweet {
  id: string;
  name: string;
  description: string;
  price: number;
  bestBeforeHours: number;
  category: string;
  shape: SweetShape;
  color: string;
  /** Relative (/api/files/...) or absolute http(s) URL. Optional until a photo is uploaded. */
  imageUrl?: string;
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SweetInput = Omit<
  Sweet,
  "id" | "createdAt" | "updatedAt"
>;

export const SWEET_SHAPES: SweetShape[] = [
  "laddu",
  "peda",
  "barfi",
  "gulabjamun",
  "jalebi",
];
