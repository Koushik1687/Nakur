import { useState, type ReactNode } from "react";

/** The shop's banner logo — save it to public/logo.png. */
const LOGO_SRC = "/Logo/logo.png";

interface BrandLogoProps {
  className?: string;
  alt?: string;
  /** Rendered if the logo file isn't present yet, so the site never shows a broken image. */
  fallback?: ReactNode;
}

export function BrandLogo({
  className,
  alt = "Girish Chandra Dey & Nakur Chandra Nandy",
  fallback,
}: BrandLogoProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    <img
      className={`brand-logo${className ? ` ${className}` : ""}`}
      src={LOGO_SRC}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
