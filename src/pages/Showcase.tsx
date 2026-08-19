import { useState } from "react";
import { APPRECIATIONS, SHOP_VIDEOS, type Appreciation } from "../data/press";
import { FolkDivider } from "../components/Decor";

/** Newspaper clipping thumbnail — falls back to a placeholder until the image is uploaded. */
function AppreciationThumb({ appr }: { appr: Appreciation }) {
  const [failed, setFailed] = useState(false);
  return (
    <a
      href={appr.fbUrl}
      target="_blank"
      rel="noreferrer"
      className="appr-thumb"
      aria-label={`${appr.title} — open on Facebook`}
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
    </a>
  );
}

export function Showcase() {
  return (
    <div className="container section showcase">
      <FolkDivider color="var(--terracotta)" />
      <div className="showcase-head">
        <h1>Appreciations</h1>
        <p className="muted">
          Press clippings and kind words from our well-wishers — tap a clipping
          to open it on Facebook or X.
        </p>
      </div>

      <div className="appr-grid">
        {APPRECIATIONS.map((a) => (
          <figure key={a.id} className="appr-tile">
            <AppreciationThumb appr={a} />
            <figcaption className="appr-body">
              <p className="appr-title">{a.title}</p>
              <div className="appr-links">
                <a
                  href={a.fbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="appr-link fb"
                >
                  Facebook
                </a>
                <a
                  href={a.xUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="appr-link x"
                >
                  X
                </a>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <FolkDivider color="var(--terracotta)" />
      <div className="showcase-head">
        <h1>YouTube Videos</h1>
        <p className="muted">
          Watch our mishti being made — from sandesh to rosogolla.
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
    </div>
  );
}
