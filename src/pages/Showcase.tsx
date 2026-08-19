import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { APPRECIATIONS, SHOP_VIDEOS, type Appreciation } from "../data/press";
import { FolkDivider } from "../components/Decor";
import type { Review } from "../types";
import { api } from "../api/client";

/** Lightbox overlay for viewing appreciation images at full size */
function Lightbox({ appr, onClose }: { appr: Appreciation; onClose: () => void }) {
  const [imgFailed, setImgFailed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="lightbox-backdrop" onClick={onClose} role="dialog" aria-label="View newspaper clipping">
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {!imgFailed ? (
          <img
            src={appr.image}
            alt={appr.title}
            className="lightbox-img"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="lightbox-fallback">
            <span className="appr-thumb-icon">📰</span>
            <p>Image not available</p>
          </div>
        )}
        <div className="lightbox-caption">
          <p className="lightbox-title">{appr.title}</p>
        </div>
      </div>
    </div>
  );
}

/** Newspaper clipping thumbnail — opens lightbox on click. */
function AppreciationThumb({ appr, onOpen }: { appr: Appreciation; onOpen: (a: Appreciation) => void }) {
  const [failed, setFailed] = useState(false);
  return (
    <button
      type="button"
      className="appr-thumb"
      aria-label={`${appr.title} — view newspaper clipping`}
      onClick={() => onOpen(appr)}
    >
      {failed ? (
        <span className="appr-thumb-ph">
          <span className="appr-thumb-icon">📰</span>
          <span className="appr-thumb-label">Newspaper clipping</span>
        </span>
      ) : (
        <img
          src={appr.image}
          alt={appr.title}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </button>
  );
}

/** Star rating display (Google-style) */
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`review-star${i <= rating ? " filled" : ""}`}>
          ★
        </span>
      ))}
    </span>
  );
}

/** Individual review card */
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-avatar">
          {review.profilePhotoUrl ? (
            <img src={review.profilePhotoUrl} alt={review.authorName} />
          ) : (
            <span>{review.authorInitials}</span>
          )}
        </div>
        <div className="review-author-info">
          <span className="review-author-name">{review.authorName}</span>
          <span className="review-date">
            {new Date(review.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
      <StarRating rating={review.rating} />
      <p className="review-text">{review.text}</p>
    </div>
  );
}

/** Google-style review summary badge */
function ReviewSummaryBadge({ averageRating, totalReviews }: { averageRating: number; totalReviews: number }) {
  return (
    <div className="review-summary-badge">
      <div className="review-summary-score">
        <span className="review-summary-num">{averageRating.toFixed(1)}</span>
        <StarRating rating={Math.round(averageRating)} />
      </div>
      <span className="review-summary-count">
        Based on {totalReviews} reviews
      </span>
    </div>
  );
}

export function Showcase() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [lightboxAppr, setLightboxAppr] = useState<Appreciation | null>(null);

  const openLightbox = useCallback((a: Appreciation) => setLightboxAppr(a), []);
  const closeLightbox = useCallback(() => setLightboxAppr(null), []);

  useEffect(() => {
    api
      .listReviews()
      .then(({ reviews }) => setReviews(reviews))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, []);

  // Show only top 4 reviews (sorted by rating desc, then by date desc)
  const topReviews = [...reviews]
    .sort((a, b) => b.rating - a.rating || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="container section showcase">
      <Helmet>
        <title>Appreciations &amp; Reviews — Nakur Chandra Nandy</title>
        <meta name="description" content="Newspaper clippings, visitor reviews, and YouTube videos featuring Girish Chandra Dey & Nakur Chandra Nandy — five generations of Bengali mishti." />
      </Helmet>

      {/* ── 1. Visitor Reviews (first) ── */}
      <FolkDivider color="var(--terracotta)" />
      <div className="showcase-head">
        <h1>What Our Visitors Say</h1>
        <p className="muted">
          Real reviews from people who have tasted our mishti — refreshed monthly from Google Maps.
        </p>
      </div>

      {reviewsLoading ? (
        <div className="reviews-loading">
          <div className="admin-loading-spinner" />
          <p>Loading reviews…</p>
        </div>
      ) : topReviews.length > 0 ? (
        <>
          <ReviewSummaryBadge averageRating={avgRating} totalReviews={reviews.length} />

          <div className="reviews-grid">
            {topReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="reviews-more">
            <Link to="/reviews" className="btn btn-primary reviews-more-btn">
              View All Reviews →
            </Link>
          </div>
        </>
      ) : (
        <div className="reviews-empty">
          <p>No reviews yet. Check back soon!</p>
        </div>
      )}

      {/* ── 2. Newspaper Appreciations ── */}
      <FolkDivider color="var(--terracotta)" />
      <div className="showcase-head">
        <h1>Appreciations</h1>
        <p className="muted">
          Over the years, newspapers and well-wishers have had kind things to
          say about our mishti — here are some of those moments.
        </p>
      </div>

      <div className="appr-grid">
        {APPRECIATIONS.map((a) => (
          <figure key={a.id} className="appr-tile">
            <AppreciationThumb appr={a} onOpen={openLightbox} />
            <figcaption className="appr-body">
              <p className="appr-title">{a.title}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* ── 3. YouTube Videos ── */}
      <FolkDivider color="var(--terracotta)" />
      <div className="showcase-head">
        <h1>YouTube Videos</h1>
        <p className="muted">
          Step inside our kitchen and watch five generations of craft in action.
        </p>
      </div>

      <div className="video-grid">
        {SHOP_VIDEOS.map((v) => (
          <div key={v.id} className="video-card">
            {v.youTubeId ? (
              <div className="video-frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.youTubeId}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="video-placeholder" aria-hidden="true">
                <span className="video-play">▶</span>
              </div>
            )}
            <p className="video-title">{v.title}</p>
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {lightboxAppr && (
        <Lightbox appr={lightboxAppr} onClose={closeLightbox} />
      )}
    </div>
  );
}
