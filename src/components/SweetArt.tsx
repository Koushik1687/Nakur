import type { CSSProperties } from "react";
import type { Sweet } from "../types";
import { api } from "../api/client";

interface SweetArtProps {
  sweet: Sweet;
  /** Optional extra class for sizing context (e.g. gallery tiles). */
  className?: string;
}

/**
 * Artwork for a sweet. If the sweet has a photo (`imageUrl`), renders it
 * full-bleed; otherwise shows a soft, shaded disc placeholder in the sweet's
 * colour.
 */
export function SweetArt({ sweet, className }: SweetArtProps) {
  const src = api.resolveImageUrl(sweet.imageUrl);
  return (
    <div className={`sweet-art${className ? ` ${className}` : ""}`} aria-hidden="true">
      {src ? (
        <img className="sweet-art-img" src={src} alt="" />
      ) : (
        <span
          className="sweet-art-sweet"
          style={{ "--art-color": sweet.color } as CSSProperties}
        />
      )}
    </div>
  );
}
