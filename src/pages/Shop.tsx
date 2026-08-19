import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api/client";
import type { Sweet } from "../types";
import { SweetCard } from "../components/SweetCard";
import { FolkDivider } from "../components/Decor";

type SortKey = "featured" | "name" | "price-asc" | "price-desc";

const PAGE_SIZE = 6;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "name", label: "Name" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

export function Shop() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter popover on outside click
  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  useEffect(() => {
    Promise.all([api.listSweets(), api.categories()])
      .then(([list, cats]) => {
        setSweets(list.sweets);
        setCategories(cats.categories);

      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = sweets;

    // category filter
    if (active) list = list.filter((s) => s.category === active);

    // text search (name, description, category)
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    // sort
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.name.localeCompare(b.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return list;
  }, [sweets, active, query, sort]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, active, sort]);

  return (
    <div className="container section">
      <div className="section-head">
        <h1>Products</h1>
      </div>

      <div className="shop-toolbar">
        <div className="search-wrap">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            type="search"
            placeholder="Search sweets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search sweets"
          />
        </div>
        <div className="filter-btn-wrap" ref={filterRef}>
          <button
            className="filter-icon-btn"
            onClick={() => setFilterOpen((o) => !o)}
            aria-label="Sort & filter"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="12" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          {filterOpen && (
            <div className="filter-popover">
              <span className="filter-popover-title">Sort by</span>
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  className={`filter-popover-opt${sort === o.value ? " active" : ""}`}
                  onClick={() => { setSort(o.value); setFilterOpen(false); }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="filters">
        <button
          className={active === null ? "chip active" : "chip"}
          onClick={() => setActive(null)}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={active === c ? "chip active" : "chip"}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="muted">Loading sweets…</p>
      ) : filtered.length === 0 ? (
        <p className="muted">No sweets match your search.</p>
      ) : (
        <>
          <div className="sweet-grid">
            {paged.map((s) => (
              <SweetCard key={s.id} sweet={s} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="shop-pagination">
              <button
                className="shop-page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <div className="shop-page-nums">
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
                      <span key={`dots-${i}`} className="shop-page-dots">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`shop-page-num${page === p ? " active" : ""}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>
              <button
                className="shop-page-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
              <span className="shop-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
            </div>
          )}
        </>
      )}

      {/* Order Online */}
      <section className="delivery-section">
        <FolkDivider color="var(--terracotta)" />
        <div className="section-head">
          <h2>Order Online</h2>
          <p className="muted">Get your favourite mishti delivered to your door</p>
        </div>
        <div className="delivery-grid">
          <a href="https://www.zomato.com/kolkata/girish-chandra-dey-nakur-chandra-nandy-hatibagan" target="_blank" rel="noopener noreferrer" className="delivery-card">
            <div className="delivery-card-icon delivery-card-icon--zm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M11.996 0C5.372 0 0 5.372 0 11.996s5.372 11.996 11.996 11.996 11.996-5.372 11.996-11.996S18.62 0 11.996 0zm5.166 16.47c-.224.376-.7.504-1.076.28l-3.09-1.836c-.12-.072-.196-.204-.196-.348v-3.6c0-.276.224-.5.5-.5h1.476c.276 0 .5.224.5.5v2.34l2.184 1.3c.376.224.504.7.28 1.076l-.578-.606z"/></svg>
            </div>
            <div className="delivery-card-body">
              <h3>Zomato</h3>
              <div className="delivery-card-rating">
                <span className="delivery-card-badge">4.8</span>
                <span className="delivery-card-stat-label">excellent · 1,618 votes</span>
              </div>
              <p className="delivery-card-detail">Dine-in & delivery available</p>
            </div>
            <span className="delivery-card-cta">Order Now →</span>
          </a>
          <a href="https://www.swiggy.com/restaurants/kolkata/hati-bagan/girish-chandra-dey-nakur-chandra-nandy-849096/dineout" target="_blank" rel="noopener noreferrer" className="delivery-card">
            <div className="delivery-card-icon delivery-card-icon--sg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-2-8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
            </div>
            <div className="delivery-card-body">
              <h3>Swiggy</h3>
              <div className="delivery-card-rating">
                <span className="delivery-card-badge delivery-card-badge--sg">★ Dineout</span>
              </div>
              <p className="delivery-card-detail">Dine-in & delivery available</p>
            </div>
            <span className="delivery-card-cta">Order Now →</span>
          </a>
        </div>
      </section>


    </div>
  );
}
