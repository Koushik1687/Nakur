import { useEffect, useState } from "react";

/**
 * Demo hero slides — replace these files (public/hero/hero-1.svg … hero-3.svg)
 * with the shop's real photos, or change the paths below.
 */
const HERO_IMAGES = [
  "/hero/hero-1.svg",
  "/hero/hero-2.svg",
  "/hero/hero-3.svg",
];

const INTERVAL_MS = 4000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % HERO_IMAGES.length),
      INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-carousel" role="img" aria-label="Girish Chandra Dey & Nakur Chandra Nandy sweets">
      {HERO_IMAGES.map((src, i) => (
        <img
          key={src}
          className={`hero-carousel-slide${i === index ? " active" : ""}`}
          src={src}
          alt=""
          aria-hidden={i !== index}
        />
      ))}
    </div>
  );
}
