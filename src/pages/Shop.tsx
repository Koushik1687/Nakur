import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { Sweet } from "../types";
import { SweetCard } from "../components/SweetCard";

type SortKey = "featured" | "name" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "name", label: "Name" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

export function Shop() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container section">
      <div className="section-head">
        <h1>The Sweet Shop</h1>
        <span className="muted">{filtered.length} items</span>
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
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort sweets"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
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
        <div className="sweet-grid">
          {filtered.map((s) => (
            <SweetCard key={s.id} sweet={s} />
          ))}
        </div>
      )}
    </div>
  );
}
