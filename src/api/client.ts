import type { Sweet, SweetInput, Review, ReviewInput } from "../types";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "";

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("gn_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  // Only set Content-Type for non-FormData bodies (browser sets multipart boundary automatically).
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  apiBase: API_BASE,

  /** Turn a stored imageUrl (relative or absolute) into a loadable src. */
  resolveImageUrl(url?: string): string | null {
    if (!url) return null;
    return /^https?:\/\//.test(url) ? url : `${API_BASE}${url}`;
  },

  /** Upload an image; returns the relative URL to store on the sweet. */
  async uploadImage(file: File): Promise<{ url: string }> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_BASE}/api/admin/upload`, {
      method: "POST",
      headers: authHeader(),
      body: form,
    });
    if (!res.ok) {
      let message = `Upload failed (${res.status})`;
      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }
    return res.json();
  },

  listSweets(params: { category?: string; featured?: boolean } = {}): Promise<{
    sweets: Sweet[];
  }> {
    const qs = new URLSearchParams();
    if (params.category) qs.set("category", params.category);
    if (params.featured) qs.set("featured", "true");
    const q = qs.toString();
    return request(`/api/sweets${q ? `?${q}` : ""}`);
  },

  getSweet(id: string): Promise<{ sweet: Sweet }> {
    return request(`/api/sweets/${id}`);
  },

  categories(): Promise<{ categories: string[] }> {
    return request("/api/categories");
  },

  login(password: string): Promise<{ token: string }> {
    return request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  logout(): Promise<{ ok: boolean }> {
    return request("/api/admin/logout", {
      method: "POST",
      headers: authHeader(),
    });
  },

  createSweet(input: SweetInput): Promise<{ sweet: Sweet }> {
    return request("/api/sweets", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(input),
    });
  },

  updateSweet(id: string, patch: Partial<SweetInput>): Promise<{ sweet: Sweet }> {
    return request(`/api/sweets/${id}`, {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify(patch),
    });
  },

  deleteSweet(id: string): Promise<void> {
    return request(`/api/sweets/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
  },

  // ── Reviews ───────────────────────────────────────────────────────

  listReviews(): Promise<{ reviews: Review[] }> {
    return request("/api/reviews");
  },

  createReview(input: ReviewInput): Promise<{ review: Review }> {
    return request("/api/reviews", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(input),
    });
  },

  updateReview(id: string, patch: Partial<ReviewInput>): Promise<{ review: Review }> {
    return request(`/api/reviews/${id}`, {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify(patch),
    });
  },

  deleteReview(id: string): Promise<void> {
    return request(`/api/reviews/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
  },
};
