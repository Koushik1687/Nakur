import { useEffect, useRef, useState } from "react";
import type { Sweet, SweetInput } from "../types";
import { SWEET_SHAPES } from "../types";
import { api } from "../api/client";

interface Props {
  initial?: Sweet | null;
  onClose: () => void;
  onSaved: (sweet: Sweet) => void;
}

const EMPTY: SweetInput = {
  name: "",
  description: "",
  price: 0,
  bestBeforeHours: 48,
  category: "Sandesh",
  shape: "laddu",
  color: "#d9a441",
  imageUrl: undefined,
  inStock: true,
  featured: false,
};

export function SweetFormModal({ initial, onClose, onSaved }: Props) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<SweetInput>(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          price: initial.price,
          bestBeforeHours: initial.bestBeforeHours,
          category: initial.category,
          shape: initial.shape,
          color: initial.color,
          imageUrl: initial.imageUrl,
          inStock: initial.inStock,
          featured: initial.featured,
        }
      : EMPTY
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [showCatList, setShowCatList] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const catRef = useRef<HTMLLabelElement>(null);

  // Load existing categories for autocomplete
  useEffect(() => {
    api.categories().then(({ categories }) => setExistingCategories(categories)).catch(() => {});
  }, []);

  // Close category dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setShowCatList(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function update<K extends keyof SweetInput>(key: K, value: SweetInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const { url } = await api.uploadImage(file);
      update("imageUrl", url);
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function onDragLeave() {
    setDragOver(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (isEdit && initial) {
        const { sweet } = await api.updateSweet(initial.id, form);
        onSaved(sweet);
      } else {
        const { sweet } = await api.createSweet(form);
        onSaved(sweet);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  const filteredCats = existingCategories.filter(
    (c) => c.toLowerCase().includes(form.category.toLowerCase()) && c !== form.category
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{isEdit ? `Edit "${initial!.name}"` : "Add New Sweet"}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="admin-form" onSubmit={submit}>
          {/* Image upload zone */}
          <div
            className={`admin-upload-zone${dragOver ? " dragover" : ""}${form.imageUrl ? " has-image" : ""}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !form.imageUrl && fileRef.current?.click()}
          >
            {form.imageUrl ? (
              <div className="admin-upload-preview">
                <img
                  src={api.resolveImageUrl(form.imageUrl) ?? undefined}
                  alt="Sweet preview"
                />
                <div className="admin-upload-overlay">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileRef.current?.click();
                    }}
                  >
                    Change Photo
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      update("imageUrl", undefined);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="admin-upload-placeholder">
                {uploading ? (
                  <>
                    <div className="admin-loading-spinner small" />
                    <span>Uploading…</span>
                  </>
                ) : (
                  <>
                    <span className="admin-upload-icon">📷</span>
                    <span className="admin-upload-text">
                      Drag &amp; drop an image here, or <strong>click to browse</strong>
                    </span>
                    <span className="admin-upload-hint">JPEG, PNG, WebP, GIF, AVIF · Max 5 MB</span>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={onFileChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </div>

          <div className="admin-form-grid">
            {/* Name */}
            <label className="admin-label span-2">
              <span className="admin-label-text">Sweet Name <span className="required">*</span></span>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Chandrapuli"
                required
              />
            </label>

            {/* Description */}
            <label className="admin-label span-2">
              <span className="admin-label-text">Description <span className="required">*</span></span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the sweet's taste, texture, and ingredients…"
                required
              />
            </label>

            {/* Price */}
            <label className="admin-label">
              <span className="admin-label-text">Price (₹) <span className="required">*</span></span>
              <input
                type="number"
                min={0}
                step={1}
                value={form.price || ""}
                onChange={(e) => update("price", Number(e.target.value))}
                placeholder="0"
                required
              />
            </label>

            {/* Best Before */}
            <label className="admin-label">
              <span className="admin-label-text">Best Before (hours) <span className="required">*</span></span>
              <input
                type="number"
                min={1}
                step={1}
                value={form.bestBeforeHours}
                onChange={(e) => update("bestBeforeHours", Number(e.target.value))}
                required
              />
            </label>

            {/* Category with autocomplete */}
            <label className="admin-label" ref={catRef} style={{ position: "relative" }}>
              <span className="admin-label-text">Category <span className="required">*</span></span>
              <input
                value={form.category}
                onChange={(e) => {
                  update("category", e.target.value);
                  setShowCatList(true);
                }}
                onFocus={() => setShowCatList(true)}
                placeholder="e.g. Sandesh, Chocolate…"
                required
                autoComplete="off"
              />
              {showCatList && filteredCats.length > 0 && (
                <div className="admin-cat-dropdown">
                  {filteredCats.slice(0, 6).map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="admin-cat-option"
                      onClick={() => {
                        update("category", c);
                        setShowCatList(false);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </label>

            {/* Shape */}
            <label className="admin-label">
              <span className="admin-label-text">Shape</span>
              <select
                value={form.shape}
                onChange={(e) => update("shape", e.target.value as SweetInput["shape"])}
              >
                {SWEET_SHAPES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            {/* Color */}
            <label className="admin-label">
              <span className="admin-label-text">Colour</span>
              <div className="admin-color-row">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => update("color", e.target.value)}
                  className="admin-color-input"
                />
                <span className="admin-color-value">{form.color}</span>
              </div>
            </label>

            {/* Toggles */}
            <div className="admin-toggle-row span-2">
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => update("inStock", e.target.checked)}
                />
                <span className={`admin-toggle-track${form.inStock ? " on" : ""}`}>
                  <span className="admin-toggle-thumb" />
                </span>
                <span className="admin-toggle-label">In Stock</span>
              </label>

              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => update("featured", e.target.checked)}
                />
                <span className={`admin-toggle-track${form.featured ? " on" : ""}`}>
                  <span className="admin-toggle-thumb" />
                </span>
                <span className="admin-toggle-label">Featured</span>
              </label>
            </div>

            {error && (
              <div className="admin-form-error span-2">
                <span>⚠</span> {error}
              </div>
            )}

            <div className="admin-form-actions span-2">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={busy} type="submit">
                {busy ? (
                  <>
                    <div className="admin-loading-spinner tiny" />
                    Saving…
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Create Sweet"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
