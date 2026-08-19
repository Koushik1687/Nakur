import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Sweet, Review } from "../types";
import { api } from "../api/client";
import { SweetFormModal } from "./SweetFormModal";
import { ReviewFormModal } from "./ReviewFormModal";

type TabKey = "sweets" | "reviews";
type SortKey = "name" | "price-asc" | "price-desc" | "newest" | "category";

const PAGE_SIZE = 12;

interface Props {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: Props) {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Sweet | null>(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabKey>("sweets");

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [addingReview, setAddingReview] = useState(false);

  // Filters
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);

  // Bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .listSweets()
      .then(({ sweets }) => setSweets(sweets))
      .catch(() => {
        localStorage.removeItem("gn_admin_token");
        onLogout?.();
        navigate("/admin");
      })
      .finally(() => setLoading(false));
  }, [navigate, onLogout]);

  useEffect(() => {
    if (!localStorage.getItem("gn_admin_token")) {
      navigate("/admin");
      return;
    }
    load();
    // Load reviews
    api.listReviews().then(({ reviews }) => setReviews(reviews)).catch(() => {});
  }, [navigate, load]);

  // Categories derived from data
  const categories = useMemo(
    () => [...new Set(sweets.map((s) => s.category))].sort(),
    [sweets]
  );

  // Stats
  const stats = useMemo(() => {
    const total = sweets.length;
    const inStock = sweets.filter((s) => s.inStock).length;
    const outOfStock = total - inStock;
    const featured = sweets.filter((s) => s.featured).length;
    const avgPrice = total
      ? Math.round(sweets.reduce((a, s) => a + s.price, 0) / total)
      : 0;
    return { total, inStock, outOfStock, featured, avgPrice, categories: categories.length };
  }, [sweets, categories]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    let list = sweets;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    if (catFilter) list = list.filter((s) => s.category === catFilter);
    if (stockFilter === "in") list = list.filter((s) => s.inStock);
    if (stockFilter === "out") list = list.filter((s) => !s.inStock);

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "category":
          return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        case "newest":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return list;
  }, [sweets, query, catFilter, stockFilter, sort]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, catFilter, stockFilter, sort]);

  // Bulk selection helpers
  const allVisibleSelected = paged.length > 0 && paged.every((s) => selected.has(s.id));
  const someSelected = selected.size > 0;

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((s) => next.delete(s.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((s) => next.add(s.id));
        return next;
      });
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selected.size} sweet(s)? This cannot be undone.`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all([...selected].map((id) => api.deleteSweet(id)));
      setSweets((prev) => prev.filter((s) => !selected.has(s.id)));
      setSelected(new Set());
    } catch (err: any) {
      setError(err.message || "Bulk delete failed.");
    } finally {
      setBulkDeleting(false);
    }
  }

  async function handleBulkToggleStock(inStock: boolean) {
    try {
      const updates = await Promise.all(
        [...selected].map((id) => api.updateSweet(id, { inStock }))
      );
      const updatedMap = new Map(updates.map((u) => [u.sweet.id, u.sweet]));
      setSweets((prev) =>
        prev.map((s) => (updatedMap.has(s.id) ? updatedMap.get(s.id)! : s))
      );
      setSelected(new Set());
    } catch (err: any) {
      setError(err.message || "Bulk update failed.");
    }
  }

  async function handleDelete(sweet: Sweet) {
    if (!confirm(`Delete "${sweet.name}"?`)) return;
    setDeletingId(sweet.id);
    try {
      await api.deleteSweet(sweet.id);
      setSweets((s) => s.filter((x) => x.id !== sweet.id));
    } catch (err: any) {
      setError(err.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleStock(sweet: Sweet) {
    try {
      const { sweet: updated } = await api.updateSweet(sweet.id, { inStock: !sweet.inStock });
      setSweets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err: any) {
      setError(err.message || "Update failed.");
    }
  }

  async function handleToggleFeatured(sweet: Sweet) {
    try {
      const { sweet: updated } = await api.updateSweet(sweet.id, { featured: !sweet.featured });
      setSweets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err: any) {
      setError(err.message || "Update failed.");
    }
  }

  async function handleLogout() {
    await api.logout().catch(() => {});
    localStorage.removeItem("gn_admin_token");
    onLogout?.();
    navigate("/admin");
  }

  // ── Review handlers ───────────────────────────────────────────────
  async function handleDeleteReview(review: Review) {
    if (!confirm(`Delete review by "${review.authorName}"?`)) return;
    try {
      await api.deleteReview(review.id);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch (err: any) {
      setError(err.message || "Delete failed.");
    }
  }

  function onReviewSaved(review: Review) {
    setReviews((list) => {
      const idx = list.findIndex((r) => r.id === review.id);
      if (idx === -1) return [review, ...list];
      const next = [...list];
      next[idx] = review;
      return next;
    });
  }

  function onSaved(sweet: Sweet) {
    setSweets((list) => {
      const idx = list.findIndex((s) => s.id === sweet.id);
      if (idx === -1) return [sweet, ...list];
      const next = [...list];
      next[idx] = sweet;
      return next;
    });
  }

  return (
    <div className="admin-panel">
      {/* Header bar */}
      <div className="admin-topbar">
        <div className="container admin-topbar-inner">
          <div className="admin-topbar-left">
            <h1 className="admin-title">Admin Panel</h1>
            <div className="admin-tabs">
              <button
                className={`admin-tab${activeTab === "sweets" ? " active" : ""}`}
                onClick={() => setActiveTab("sweets")}
              >
                🍬 Sweets
              </button>
              <button
                className={`admin-tab${activeTab === "reviews" ? " active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                ⭐ Reviews
              </button>
            </div>
          </div>
          <div className="admin-topbar-actions">
            {activeTab === "sweets" ? (
              <button className="btn btn-primary" onClick={() => setAdding(true)}>
                <span className="admin-btn-icon">+</span>
                Add Sweet
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setAddingReview(true)}>
                <span className="admin-btn-icon">+</span>
                Add Review
              </button>
            )}
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container admin-content">
        {error && (
          <div className="admin-alert admin-alert-error">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="admin-alert-close">×</button>
          </div>
        )}

        {/* Stats cards - Sweets tab */}
        {activeTab === "sweets" && (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: "rgba(177,67,36,0.1)", color: "var(--terracotta)" }}>🍬</div>
            <div className="admin-stat-body">
              <span className="admin-stat-num">{stats.total}</span>
              <span className="admin-stat-label">Total Sweets</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: "rgba(78,122,63,0.12)", color: "var(--ok)" }}>✓</div>
            <div className="admin-stat-body">
              <span className="admin-stat-num">{stats.inStock}</span>
              <span className="admin-stat-label">In Stock</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: "rgba(176,74,47,0.12)", color: "var(--warn)" }}>✗</div>
            <div className="admin-stat-body">
              <span className="admin-stat-num">{stats.outOfStock}</span>
              <span className="admin-stat-label">Out of Stock</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: "rgba(185,136,47,0.12)", color: "var(--gold)" }}>★</div>
            <div className="admin-stat-body">
              <span className="admin-stat-num">{stats.featured}</span>
              <span className="admin-stat-label">Featured</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: "rgba(47,62,99,0.1)", color: "var(--indigo)" }}>📁</div>
            <div className="admin-stat-body">
              <span className="admin-stat-num">{stats.categories}</span>
              <span className="admin-stat-label">Categories</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: "rgba(177,67,36,0.1)", color: "var(--terracotta)" }}>₹</div>
            <div className="admin-stat-body">
              <span className="admin-stat-num">₹{stats.avgPrice}</span>
              <span className="admin-stat-label">Avg Price</span>
            </div>
          </div>
        </div>
        )}

        {/* Stats cards - Reviews tab */}
        {activeTab === "reviews" && (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: "rgba(244,180,0,0.12)", color: "#f4b400" }}>⭐</div>
            <div className="admin-stat-body">
              <span className="admin-stat-num">{reviews.length}</span>
              <span className="admin-stat-label">Total Reviews</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: "rgba(78,122,63,0.12)", color: "var(--ok)" }}>★</div>
            <div className="admin-stat-body">
              <span className="admin-stat-num">
                {reviews.length > 0
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : "—"}
              </span>
              <span className="admin-stat-label">Avg Rating</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: "rgba(177,67,36,0.1)", color: "var(--terracotta)" }}>5★</div>
            <div className="admin-stat-body">
              <span className="admin-stat-num">{reviews.filter((r) => r.rating === 5).length}</span>
              <span className="admin-stat-label">5-Star Reviews</span>
            </div>
          </div>
        </div>
        )}

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <svg className="admin-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="admin-search-input"
              type="search"
              placeholder="Search sweets by name, description, category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="admin-filter-row">
            <select
              className="admin-select"
              value={catFilter ?? ""}
              onChange={(e) => setCatFilter(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="admin-stock-pills">
              {(["all", "in", "out"] as const).map((v) => (
                <button
                  key={v}
                  className={`admin-pill${stockFilter === v ? " active" : ""}`}
                  onClick={() => setStockFilter(v)}
                >
                  {v === "all" ? "All" : v === "in" ? "In Stock" : "Out of Stock"}
                </button>
              ))}
            </div>

            <select
              className="admin-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="newest">Newest</option>
              <option value="name">Name A–Z</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Bulk actions bar */}
        {someSelected && (
          <div className="admin-bulk-bar">
            <span className="admin-bulk-count">{selected.size} selected</span>
            <div className="admin-bulk-actions">
              <button className="btn btn-sm btn-ghost" onClick={() => handleBulkToggleStock(true)}>
                Mark In Stock
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => handleBulkToggleStock(false)}>
                Mark Out of Stock
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
              >
                {bulkDeleting ? "Deleting…" : "Delete Selected"}
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => setSelected(new Set())}>
                Clear
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading-spinner" />
            <p>Loading sweets…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">🍬</span>
            <h3>No sweets found</h3>
            <p>{query || catFilter || stockFilter !== "all" ? "Try adjusting your filters." : "Add your first sweet to get started."}</p>
            {!query && !catFilter && stockFilter === "all" && (
              <button className="btn btn-primary" onClick={() => setAdding(true)}>
                + Add Sweet
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table view */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="admin-th-check">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAll}
                        className="admin-checkbox"
                      />
                    </th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th className="admin-th-hide-sm">Category</th>
                    <th>Price</th>
                    <th className="admin-th-hide-sm">Best Before</th>
                    <th>Stock</th>
                    <th className="admin-th-hide-sm">Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((s) => (
                    <tr key={s.id} className={selected.has(s.id) ? "row-selected" : ""}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(s.id)}
                          onChange={() => toggleSelect(s.id)}
                          className="admin-checkbox"
                        />
                      </td>
                      <td>
                        {s.imageUrl ? (
                          <img
                            className="admin-thumb"
                            src={api.resolveImageUrl(s.imageUrl) ?? undefined}
                            alt=""
                          />
                        ) : (
                          <div className="admin-thumb-placeholder" style={{ background: s.color }}>
                            <span>{s.name.charAt(0)}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="admin-name-cell">
                          <span className="admin-name">{s.name}</span>
                          <span className="admin-cat-mobile">{s.category}</span>
                        </div>
                      </td>
                      <td className="admin-th-hide-sm">
                        <span className="admin-cat-badge">{s.category}</span>
                      </td>
                      <td>
                        <span className="admin-price">₹{s.price}</span>
                      </td>
                      <td className="admin-th-hide-sm">
                        <span className="admin-bbh">{s.bestBeforeHours}h</span>
                      </td>
                      <td>
                        <button
                          className={`admin-stock-toggle${s.inStock ? " in" : " out"}`}
                          onClick={() => handleToggleStock(s)}
                          title={`Click to mark as ${s.inStock ? "out of stock" : "in stock"}`}
                        >
                          {s.inStock ? "In Stock" : "Out"}
                        </button>
                      </td>
                      <td className="admin-th-hide-sm">
                        <button
                          className={`admin-feat-toggle${s.featured ? " active" : ""}`}
                          onClick={() => handleToggleFeatured(s)}
                          title={`Click to ${s.featured ? "unfeature" : "feature"}`}
                        >
                          {s.featured ? "★" : "☆"}
                        </button>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="admin-action-btn edit"
                            onClick={() => setEditing(s)}
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            className="admin-action-btn delete"
                            disabled={deletingId === s.id}
                            onClick={() => handleDelete(s)}
                            title="Delete"
                          >
                            {deletingId === s.id ? "…" : "🗑"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="admin-cards">
              {paged.map((s) => (
                <div key={s.id} className={`admin-card${selected.has(s.id) ? " selected" : ""}`}>
                  <div className="admin-card-header">
                    <input
                      type="checkbox"
                      checked={selected.has(s.id)}
                      onChange={() => toggleSelect(s.id)}
                      className="admin-checkbox"
                    />
                    <div className="admin-card-img">
                      {s.imageUrl ? (
                        <img src={api.resolveImageUrl(s.imageUrl) ?? undefined} alt="" />
                      ) : (
                        <div className="admin-thumb-placeholder" style={{ background: s.color }}>
                          <span>{s.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="admin-card-info">
                      <h3 className="admin-card-name">{s.name}</h3>
                      <span className="admin-cat-badge">{s.category}</span>
                    </div>
                  </div>
                  <div className="admin-card-meta">
                    <span className="admin-price">₹{s.price}</span>
                    <span className="admin-bbh">{s.bestBeforeHours}h</span>
                    <button
                      className={`admin-stock-toggle${s.inStock ? " in" : " out"}`}
                      onClick={() => handleToggleStock(s)}
                    >
                      {s.inStock ? "In Stock" : "Out"}
                    </button>
                    <button
                      className={`admin-feat-toggle${s.featured ? " active" : ""}`}
                      onClick={() => handleToggleFeatured(s)}
                    >
                      {s.featured ? "★" : "☆"}
                    </button>
                  </div>
                  <div className="admin-card-actions">
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditing(s)}>
                      ✎ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      disabled={deletingId === s.id}
                      onClick={() => handleDelete(s)}
                    >
                      {deletingId === s.id ? "…" : "🗑 Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  className="admin-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <div className="admin-page-nums">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 7) return true;
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - page) <= 1) return true;
                      return false;
                    })
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`dots-${i}`} className="admin-page-dots">…</span>
                      ) : (
                        <button
                          key={p}
                          className={`admin-page-num${page === p ? " active" : ""}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>
                <button
                  className="admin-page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
                <span className="admin-page-info">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reviews Tab Content */}
      {activeTab === "reviews" && (
      <div className="admin-content">
        {reviews.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">⭐</span>
            <h3>No reviews yet</h3>
            <p>Add your first review to get started.</p>
            <button className="btn btn-primary" onClick={() => setAddingReview(true)}>
              + Add Review
            </button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reviewer</th>
                  <th>Rating</th>
                  <th className="admin-th-hide-sm">Date</th>
                  <th>Review</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="admin-name-cell">
                        <div className="review-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                          <span>{r.authorInitials}</span>
                        </div>
                        <span className="admin-name">{r.authorName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="review-stars" style={{ fontSize: 14 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span key={i} className={`review-star${i <= r.rating ? " filled" : ""}`}>★</span>
                        ))}
                      </span>
                    </td>
                    <td className="admin-th-hide-sm">
                      <span className="admin-bbh">
                        {new Date(r.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </td>
                    <td>
                      <span className="admin-name" style={{ maxWidth: 300, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {r.text}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          className="admin-action-btn edit"
                          onClick={() => setEditingReview(r)}
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => handleDeleteReview(r)}
                          title="Delete"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Modals */}
      {adding && (
        <SweetFormModal
          onClose={() => setAdding(false)}
          onSaved={(s) => {
            onSaved(s);
            setAdding(false);
          }}
        />
      )}
      {editing && (
        <SweetFormModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={(s) => {
            onSaved(s);
            setEditing(null);
          }}
        />
      )}
      {addingReview && (
        <ReviewFormModal
          onClose={() => setAddingReview(false)}
          onSaved={(r) => {
            onReviewSaved(r);
            setAddingReview(false);
          }}
        />
      )}
      {editingReview && (
        <ReviewFormModal
          initial={editingReview}
          onClose={() => setEditingReview(null)}
          onSaved={(r) => {
            onReviewSaved(r);
            setEditingReview(null);
          }}
        />
      )}

    </div>
  );
}
