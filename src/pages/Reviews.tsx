import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "../api/client";
import type { Review } from "../types";
import { FolkDivider } from "../components/Decor";

const SITE_URL = "https://nakur.in";

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
function ReviewSummaryBadge({
  averageRating,
  totalReviews,
}: {
  averageRating: number;
  totalReviews: number;
}) {
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

const GOOGLE_MAPS_REVIEW_URL =
  "https://www.google.com/maps/place/Girish+Chandra+Dey+%26+Nakur+Chandra+Nandy/@22.5804,88.3639,17z/data=!4m8!3m7!1s0x3a0277c7a23e4b7d:0x1234567890abcdef!8m2!3d22.5804!4d88.3639!9m1!1b1!16s%2Fg%2F1td1k1hw";

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    api
      .listReviews()
      .then(({ reviews }) => setReviews(reviews))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, []);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const metaDescription =
    reviews.length > 0
      ? `Read what visitors say about our Bengali mishti. ${reviews.length} reviews with an average rating of ${avgRating.toFixed(1)}/5. Taste what five generations of craft have created.`
      : "Read visitor reviews of Girish Chandra Dey & Nakur Chandra Nandy — handmade Bengali mishti since 1844.";

  return (
    <div className="container section showcase">
      <Helmet>
        <title>Reviews — Nakur Chandra Nandy · Bengali Mishti since 1844</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`${SITE_URL}/reviews`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/reviews`} />
        <meta
          property="og:title"
          content="Visitor Reviews — Nakur Chandra Nandy"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={`${SITE_URL}/Logo/logo.png`} />
        <meta
          property="og:image:alt"
          content="Nakur Chandra Nandy — Bengali Mishti since 1844"
        />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Nakur Chandra Nandy" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Visitor Reviews — Nakur Chandra Nandy"
        />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={`${SITE_URL}/Logo/logo.png`} />
        <meta
          name="twitter:image:alt"
          content="Nakur Chandra Nandy — Bengali Mishti since 1844"
        />
      </Helmet>

      <FolkDivider color="var(--terracotta)" />
      <div className="showcase-head">
        <h1>What Our Visitors Say</h1>
        <p className="muted">
          Real reviews from people who have tasted our mishti — refreshed
          monthly from Google Maps.
        </p>
      </div>

      {reviewsLoading ? (
        <div className="reviews-loading">
          <div className="admin-loading-spinner" />
          <p>Loading reviews…</p>
        </div>
      ) : reviews.length > 0 ? (
        <>
          <ReviewSummaryBadge
            averageRating={avgRating}
            totalReviews={reviews.length}
          />

          <div className="reviews-grid">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="reviews-more">
            <a
              href={GOOGLE_MAPS_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary reviews-more-btn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Read More Reviews on Google Maps
            </a>
          </div>
        </>
      ) : (
        <div className="reviews-empty">
          <p>No reviews yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
