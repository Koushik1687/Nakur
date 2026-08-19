import { useState } from "react";
import type { Review, ReviewInput } from "../types";
import { api } from "../api/client";

interface Props {
  initial?: Review | null;
  onClose: () => void;
  onSaved: (review: Review) => void;
}

const EMPTY: ReviewInput = {
  authorName: "",
  authorInitials: "",
  rating: 5,
  text: "",
  publishedAt: new Date().toISOString().split("T")[0],
  profilePhotoUrl: undefined,
  googleMapsUrl: undefined,
};

export function ReviewFormModal({ initial, onClose, onSaved }: Props) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<ReviewInput>(
    initial
      ? {
          authorName: initial.authorName,
          authorInitials: initial.authorInitials,
          rating: initial.rating,
          text: initial.text,
          publishedAt: initial.publishedAt,
          profilePhotoUrl: initial.profilePhotoUrl,
          googleMapsUrl: initial.googleMapsUrl,
        }
      : EMPTY
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function update<K extends keyof ReviewInput>(key: K, value: ReviewInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function generateInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const input = {
        ...form,
        authorInitials: form.authorInitials || generateInitials(form.authorName),
        publishedAt: form.publishedAt || new Date().toISOString(),
      };
      if (isEdit && initial) {
        const { review } = await api.updateReview(initial.id, input);
        onSaved(review);
      } else {
        const { review } = await api.createReview(input);
        onSaved(review);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{isEdit ? `Edit Review` : "Add New Review"}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="admin-form" onSubmit={submit}>
          <div className="admin-form-grid">
            {/* Author Name */}
            <label className="admin-label span-2">
              <span className="admin-label-text">
                Reviewer Name <span className="required">*</span>
              </span>
              <input
                value={form.authorName}
                onChange={(e) => update("authorName", e.target.value)}
                placeholder="e.g. Priya Banerjee"
                required
              />
            </label>

            {/* Author Initials */}
            <label className="admin-label">
              <span className="admin-label-text">Initials (auto-generated if empty)</span>
              <input
                value={form.authorInitials}
                onChange={(e) => update("authorInitials", e.target.value)}
                placeholder="PB"
                maxLength={2}
              />
            </label>

            {/* Rating */}
            <label className="admin-label">
              <span className="admin-label-text">
                Rating <span className="required">*</span>
              </span>
              <select
                value={form.rating}
                onChange={(e) => update("rating", Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {"★".repeat(r)} ({r}/5)
                  </option>
                ))}
              </select>
            </label>

            {/* Review Text */}
            <label className="admin-label span-2">
              <span className="admin-label-text">
                Review Text <span className="required">*</span>
              </span>
              <textarea
                rows={4}
                value={form.text}
                onChange={(e) => update("text", e.target.value)}
                placeholder="What did the reviewer say about the sweets..."
                required
              />
            </label>

            {/* Published Date */}
            <label className="admin-label">
              <span className="admin-label-text">Review Date</span>
              <input
                type="date"
                value={form.publishedAt ? form.publishedAt.split("T")[0] : ""}
                onChange={(e) =>
                  update("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : "")
                }
              />
            </label>

            {/* Profile Photo URL */}
            <label className="admin-label">
              <span className="admin-label-text">Profile Photo URL (optional)</span>
              <input
                value={form.profilePhotoUrl || ""}
                onChange={(e) => update("profilePhotoUrl", e.target.value || undefined)}
                placeholder="https://..."
              />
            </label>

            {/* Google Maps URL */}
            <label className="admin-label span-2">
              <span className="admin-label-text">Google Maps Review URL (optional)</span>
              <input
                value={form.googleMapsUrl || ""}
                onChange={(e) => update("googleMapsUrl", e.target.value || undefined)}
                placeholder="https://www.google.com/maps/place/..."
              />
            </label>

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
                  "Add Review"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
