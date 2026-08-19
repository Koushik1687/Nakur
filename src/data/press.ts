/**
 * Press appreciations + YouTube videos shown on the Showcase page.
 *
 * To make this live:
 *  1. Save the 16 newspaper screenshots as
 *     public/appreciations/appreciation-1.jpg … appreciation-16.jpg
 *     (any extension works if you update `image` below).
 *  2. Fill in the real Facebook (fbUrl) and X (xUrl) post URLs per item.
 *  3. Add the real YouTube video IDs (the 11-char part of youtube.com/watch?v=…).
 * Each appreciation tile falls back to a placeholder until its image exists.
 */

export interface Appreciation {
  id: string;
  /** Caption shown under the clipping, e.g. the newspaper + date. */
  title: string;
  /** Path to the screenshot in public/. */
  image: string;
  /** Facebook post URL — TODO: replace. */
  fbUrl: string;
  /** X (Twitter) post URL — TODO: replace. */
  xUrl: string;
}

export interface ShopVideo {
  id: string;
  title: string;
  /** The 11-character YouTube ID, e.g. "dQw4w9WgXcQ". Empty until provided. */
  youTubeId: string;
}

export const APPRECIATIONS: Appreciation[] = Array.from(
  { length: 16 },
  (_, i) => ({
    id: `appr-${i + 1}`,
    title: `Appreciation ${i + 1}`,
    image: `/appreciations/appreciation-${i + 1}.jpg`,
    fbUrl: "#",
    xUrl: "#",
  })
);

export const SHOP_VIDEOS: ShopVideo[] = [
  {
    id: "video-1",
    title: "Nakur Sweets: Mouth watering Bengali Sweets!",
    youTubeId: "bo489PNZbL4",
  },
  {
    id: "video-2",
    title: "Kolkata Food Walk - Nokurer Sondesh/Sweet",
    youTubeId: "I9cbNHrjPsM",
  },
  {
    id: "video-3",
    title: "Jamai Shasthi Special Sandesh Nokur Nandi Kolkata",
    youTubeId: "J0PfnCdtEBM",
  },
  {
    id: "video-4",
    title: "Girish Nakur @ Mirakkel Akkel Challenger 7",
    youTubeId: "RK9FHtPSfIE",
  },
];
