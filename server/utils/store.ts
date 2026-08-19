import type { Sweet, SweetInput } from "./types";

/**
 * Persisted via Nitro's storage layer so the same code runs as serverless
 * functions on any provider. Configure the `data` mount in nitro.config.ts
 * (fs locally, KV/Blob/S3 in production). One key holds the whole catalogue.
 */
const STORAGE_KEY = "sweets";

const SEED: Sweet[] = [
  // ── Sandesh ────────────────────────────────────────────────────────
  {
    id: "chandrapuli",
    name: "Chandrapuli",
    description: "Shaped like the crescent moon, this sandesh is made with fresh chhena and a whisper of cardamom — a quiet classic that has been a favourite at evening addas for decades.",
    price: 30,
    bestBeforeHours: 60,
    category: "Sandesh",
    shape: "barfi",
    color: "#f5e1c0",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "monopuli",
    name: "Monopuli",
    description: "A soft, crumbly centre wrapped in a golden exterior — the kind of sandesh that disappears from the plate before you notice.",
    price: 35,
    bestBeforeHours: 48,
    category: "Sandesh",
    shape: "peda",
    color: "#e8c27a",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "golapi-pera",
    name: "Golapi Pera",
    description: "Rose-tinted and delicately floral, this milk pera has the gentle sweetness of a Kolkata spring morning.",
    price: 20,
    bestBeforeHours: 24,
    category: "Sandesh",
    shape: "peda",
    color: "#e8a0b4",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "jalbhara",
    name: "Jalbhara",
    description: "A shell of chhena filled with syrup that bursts in your mouth — the name means 'water-filled', and one bite tells you why it's our most requested sweet.",
    price: 30,
    bestBeforeHours: 48,
    category: "Sandesh",
    shape: "gulabjamun",
    color: "#d4a76a",
    inStock: true,
    featured: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "kanthal",
    name: "Kanthal",
    description: "Jackfruit-flavoured sandesh with the warm sweetness of a Bengal summer — golden, fragrant, and unmistakably seasonal.",
    price: 25,
    bestBeforeHours: 48,
    category: "Sandesh",
    shape: "peda",
    color: "#d4a017",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "guti-monohara",
    name: "Guti Monohara",
    description: "Tiny, jewel-like balls that melt on the tongue — monohara means 'heart-stealer', and these little bites live up to the name.",
    price: 25,
    bestBeforeHours: 48,
    category: "Sandesh",
    shape: "laddu",
    color: "#e8c87a",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sorpuria",
    name: "Sorpuria",
    description: "Light, airy, and dusted with a hint of saffron — a sweet so delicate it feels like it might float off your plate.",
    price: 30,
    bestBeforeHours: 12,
    category: "Sandesh",
    shape: "peda",
    color: "#f0d89a",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "dilkhush",
    name: "Dilkhush",
    description: "A heart-pleasing sandesh with a rich, nutty centre — dilkhush literally means 'one who makes the heart happy'.",
    price: 25,
    bestBeforeHours: 12,
    category: "Sandesh",
    shape: "barfi",
    color: "#c9a96e",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "parijat",
    name: "Parijat",
    description: "Named after the night-flowering parijat blossom, this sandesh carries a subtle floral fragrance that lingers long after the last bite.",
    price: 25,
    bestBeforeHours: 12,
    category: "Sandesh",
    shape: "peda",
    color: "#f5e6c8",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sachin",
    name: "Sachin",
    description: "A modern sandesh with a mildly sweet, creamy profile — smooth and unhurried, like a lazy Sunday afternoon.",
    price: 25,
    bestBeforeHours: 24,
    category: "Sandesh",
    shape: "peda",
    color: "#e2c78f",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sourav",
    name: "Sourav",
    description: "Hand-pressed with a subtle caramel undertone — simple, smooth, and quietly satisfying.",
    price: 20,
    bestBeforeHours: 12,
    category: "Sandesh",
    shape: "peda",
    color: "#dbb87a",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "utsav",
    name: "Utsav",
    description: "Decorated with silver leaf and crushed pistachios, utsav means 'celebration' — and this sandesh was made for exactly that.",
    price: 25,
    bestBeforeHours: 48,
    category: "Sandesh",
    shape: "barfi",
    color: "#e8d5a3",
    inStock: true,
    featured: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "nutty-sandesh",
    name: "Nutty Sandesh",
    description: "Roasted nuts folded into creamy chhena for a sweet that crunches and melts at the same time.",
    price: 20,
    bestBeforeHours: 48,
    category: "Sandesh",
    shape: "peda",
    color: "#c49a5c",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sugar-free",
    name: "Sugar Free",
    description: "The same handcrafted taste, sweetened without refined sugar — for those who want the tradition without the guilt.",
    price: 20,
    bestBeforeHours: 12,
    category: "Sandesh",
    shape: "peda",
    color: "#f0e0c0",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "babu",
    name: "Babu",
    description: "A Kolkata sweetshop classic — dense, fudgy, and deeply satisfying. The kind of sandesh elders reach for first.",
    price: 25,
    bestBeforeHours: 48,
    category: "Sandesh",
    shape: "peda",
    color: "#d4a76a",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // ── Gurer Mithai (Jaggery-based) ──────────────────────────────────
  {
    id: "gurer-barfi",
    name: "Gurer Barfi",
    description: "Rich jaggery barfi with the deep, earthy sweetness of date palm gur — dense and fudgy, best enjoyed slow.",
    price: 30,
    bestBeforeHours: 60,
    category: "Gurer Mithai",
    shape: "barfi",
    color: "#a06828",
    inStock: true,
    featured: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-chandrapuli",
    name: "Gurer Chandrapuli",
    description: "The crescent moon sandesh, reimagined with nolen gur — carrying the smoky warmth of date palm jaggery in every bite.",
    price: 30,
    bestBeforeHours: 60,
    category: "Gurer Mithai",
    shape: "barfi",
    color: "#8b5e3c",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-jalbhara",
    name: "Gurer Jalbhara",
    description: "Syrup-stuffed sandesh infused with nolen gur — the burst of jaggery-sweet liquid is a winter ritual in Bengal.",
    price: 40,
    bestBeforeHours: 60,
    category: "Gurer Mithai",
    shape: "gulabjamun",
    color: "#7a4a2a",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-kanchagollab",
    name: "Gurer Kanchagollab",
    description: "A ruby-red sandesh with a jaggery core — beautiful to look at and even better to eat.",
    price: 25,
    bestBeforeHours: 24,
    category: "Gurer Mithai",
    shape: "laddu",
    color: "#b8432f",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-karapak-jalbhara",
    name: "Gurer Karapak Jalbhara",
    description: "A caramelised jaggery shell that crackles when you bite through, giving way to a molten centre — our most indulgent winter sweet.",
    price: 40,
    bestBeforeHours: 100,
    category: "Gurer Mithai",
    shape: "gulabjamun",
    color: "#6b3a1e",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-karapak-talsash",
    name: "Gurer Karapak Talsash",
    description: "A caramelised jaggery shell with layered, fudge-like filling — Nakur's signature crunch that customers travel across the city for.",
    price: 40,
    bestBeforeHours: 100,
    category: "Gurer Mithai",
    shape: "barfi",
    color: "#7a4420",
    inStock: true,
    featured: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-monohara",
    name: "Gurer Monohara",
    description: "Jaggery-infused and impossibly smooth — the heart-stealer that tastes like a Bengali winter evening.",
    price: 25,
    bestBeforeHours: 24,
    category: "Gurer Mithai",
    shape: "peda",
    color: "#a06030",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-monopuli",
    name: "Gurer Monopuli",
    description: "The classic Monopuli, reimagined with date palm jaggery — an autumnal twist on a year-round favourite.",
    price: 20,
    bestBeforeHours: 60,
    category: "Gurer Mithai",
    shape: "peda",
    color: "#b87030",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-mousumi",
    name: "Gurer Mousumi",
    description: "A seasonal sandesh fragrant with nolen gur and cardamom — the kind of sweet that makes you close your eyes while eating.",
    price: 30,
    bestBeforeHours: 60,
    category: "Gurer Mithai",
    shape: "peda",
    color: "#c07830",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-ratabi",
    name: "Gurer Ratabi",
    description: "Firm, long-lasting, and deep in caramel flavour — ratabi is the sweet you pack for a long journey.",
    price: 20,
    bestBeforeHours: 100,
    category: "Gurer Mithai",
    shape: "barfi",
    color: "#8b5e3c",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-mohini",
    name: "Gurer Mohini",
    description: "Mesmerising in its golden sweetness — mohini means 'enchantress', and this jaggery sandesh earns the name.",
    price: 30,
    bestBeforeHours: 12,
    category: "Gurer Mithai",
    shape: "peda",
    color: "#b06828",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // ── Karapak & Talsash ─────────────────────────────────────────────
  {
    id: "jafraan-karapak-talsash",
    name: "Jafraan Karapak Talsash",
    description: "Saffron-infused caramelised sandesh with a crisp shell and a luxurious, layered filling — our most refined talsash.",
    price: 30,
    bestBeforeHours: 100,
    category: "Karapak & Talsash",
    shape: "barfi",
    color: "#d4a030",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "karapak-talsash",
    name: "Karapak Talsash",
    description: "Caramelised shell, layered centre, signature crunch — this is the sweet that put Nakur on the map.",
    price: 30,
    bestBeforeHours: 100,
    category: "Karapak & Talsash",
    shape: "barfi",
    color: "#a07040",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "korapak-ratabi",
    name: "Korapak Ratabi",
    description: "A hard, caramelised exterior with a chewy, flavourful core — built to last and built to satisfy.",
    price: 20,
    bestBeforeHours: 100,
    category: "Karapak & Talsash",
    shape: "barfi",
    color: "#8b6040",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // ── Rolls ──────────────────────────────────────────────────────────
  {
    id: "malai-roll",
    name: "Malai Roll",
    description: "Delicate sheets of chhena rolled around a creamy malai filling — so soft it practically dissolves on your tongue.",
    price: 30,
    bestBeforeHours: 12,
    category: "Rolls",
    shape: "barfi",
    color: "#f5eed6",
    inStock: true,
    featured: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "butter-scotch-malai-roll",
    name: "Butter Scotch Malai Roll",
    description: "A buttery, toffee-flavoured twist on the beloved malai roll — rich without being heavy.",
    price: 30,
    bestBeforeHours: 12,
    category: "Rolls",
    shape: "barfi",
    color: "#d4a860",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "chocolate-malai-roll",
    name: "Chocolate Malai Roll",
    description: "Cocoa-dusted chhena wrapped around a luscious cream centre — where Bengal meets Belgium.",
    price: 30,
    bestBeforeHours: 12,
    category: "Rolls",
    shape: "barfi",
    color: "#5a3020",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "gurer-malai-roll",
    name: "Gurer Malai Roll",
    description: "Jaggery-kissed malai roll with the earthy warmth of nolen gur — winter comfort, rolled up.",
    price: 30,
    bestBeforeHours: 12,
    category: "Rolls",
    shape: "barfi",
    color: "#a06828",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "mango-malai-roll",
    name: "Mango Malai Roll",
    description: "Alphonso mango pulp swirled into creamy malai — summer in every bite, no matter the season.",
    price: 25,
    bestBeforeHours: 12,
    category: "Rolls",
    shape: "barfi",
    color: "#f0a020",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "malai-singara",
    name: "Malai Singara",
    description: "A crispy-edged singara stuffed with rich malai and dry fruits — part sweet, part savoury, entirely irresistible.",
    price: 65,
    bestBeforeHours: 12,
    category: "Rolls",
    shape: "jalebi",
    color: "#f0e0c0",
    inStock: true,
    featured: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "singara-sandesh-dry-fruit",
    name: "Singara Sandesh (Dry Fruit)",
    description: "A crispy singara sandesh packed with assorted dry fruits and nuts — for when one kind of indulgence isn't enough.",
    price: 45,
    bestBeforeHours: 72,
    category: "Rolls",
    shape: "jalebi",
    color: "#c8a050",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // ── Chocolate ──────────────────────────────────────────────────────
  {
    id: "chocolate-black-forest",
    name: "Chocolate Black Forest",
    description: "Layers of cocoa sponge and cream — a Bengali reinterpretation of the German classic, made fresh with chhena.",
    price: 15,
    bestBeforeHours: 60,
    category: "Chocolate",
    shape: "barfi",
    color: "#3a1a0a",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "chocolate-choco-fillings",
    name: "Chocolate Choco Fillings",
    description: "A chocolate shell hiding a molten centre — break it open and let the inside do the talking.",
    price: 30,
    bestBeforeHours: 60,
    category: "Chocolate",
    shape: "laddu",
    color: "#4a2010",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "chocolate-chips",
    name: "Chocolate Chips",
    description: "Mini chocolate-studded sandesh bites — crunchy, addictive, and gone before you know it.",
    price: 20,
    bestBeforeHours: 60,
    category: "Chocolate",
    shape: "laddu",
    color: "#5a3018",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "chocolate-dark",
    name: "Chocolate Dark",
    description: "Intensely dark, deeply satisfying — for the cocoa purist who takes their sweetness seriously.",
    price: 30,
    bestBeforeHours: 24,
    category: "Chocolate",
    shape: "barfi",
    color: "#2a1008",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "chocolate-monopuli",
    name: "Chocolate Monopuli",
    description: "The Monopuli you love, wrapped in a rich chocolate coating — a fusion that just works.",
    price: 35,
    bestBeforeHours: 48,
    category: "Chocolate",
    shape: "peda",
    color: "#4a2518",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "chocolate-rice-ball",
    name: "Chocolate Rice Ball",
    description: "Crispy rice cereal coated in Belgian chocolate — playful, crunchy, and impossible to stop at one.",
    price: 25,
    bestBeforeHours: 60,
    category: "Chocolate",
    shape: "laddu",
    color: "#5a3820",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "chocolate-singara",
    name: "Chocolate Singara",
    description: "A crispy, golden singara filled with dark chocolate ganache — the crossover nobody expected but everyone loves.",
    price: 45,
    bestBeforeHours: 60,
    category: "Chocolate",
    shape: "jalebi",
    color: "#3a1a0a",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // ── Flavoured Sandesh ──────────────────────────────────────────────
  {
    id: "black-current",
    name: "Black Current",
    description: "Vibrant blackcurrant-infused sandesh with a tangy berry burst — bold, bright, and unmistakably fruity.",
    price: 25,
    bestBeforeHours: 48,
    category: "Flavoured Sandesh",
    shape: "peda",
    color: "#4a1050",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "butter-scotch",
    name: "Butter Scotch",
    description: "Buttery, toffee-flavoured sandesh with a caramel sweetness — comfort food, Bengali style.",
    price: 25,
    bestBeforeHours: 48,
    category: "Flavoured Sandesh",
    shape: "peda",
    color: "#d4a040",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "coffee",
    name: "Coffee",
    description: "Rich espresso-infused sandesh with a smooth, aromatic finish — for those who like their mishti with a kick.",
    price: 25,
    bestBeforeHours: 48,
    category: "Flavoured Sandesh",
    shape: "peda",
    color: "#6a4a2a",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "kiwi",
    name: "Kiwi",
    description: "Tangy kiwi-flavoured sandesh with a refreshing, fruity zing — a palate cleanser disguised as a sweet.",
    price: 25,
    bestBeforeHours: 48,
    category: "Flavoured Sandesh",
    shape: "peda",
    color: "#6aaa20",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "lebu",
    name: "Lebu",
    description: "Zesty lemon sandesh — bright, citrusy, and just the thing to wake up your tastebuds after a rich meal.",
    price: 20,
    bestBeforeHours: 12,
    category: "Flavoured Sandesh",
    shape: "peda",
    color: "#f0e040",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "mango",
    name: "Mango",
    description: "Luscious Alphonso mango sandesh with a tropical, sun-ripened sweetness that tastes like a Kolkata summer.",
    price: 30,
    bestBeforeHours: 48,
    category: "Flavoured Sandesh",
    shape: "peda",
    color: "#f0a020",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "mango-amrapali",
    name: "Mango Amrapali",
    description: "Premium Amrapali mango sandesh with an intense, velvety flavour — the king of mangoes, the king of sandesh.",
    price: 30,
    bestBeforeHours: 48,
    category: "Flavoured Sandesh",
    shape: "peda",
    color: "#e89010",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "orange",
    name: "Orange",
    description: "Sunshine-orange sandesh with a fresh, citrusy aroma — light enough for a midday treat.",
    price: 25,
    bestBeforeHours: 48,
    category: "Flavoured Sandesh",
    shape: "peda",
    color: "#f08020",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "orange-lemon",
    name: "Orange Lemon",
    description: "A citrus duo — orange and lemon blended into one sandesh for a tangy twist that keeps you coming back.",
    price: 25,
    bestBeforeHours: 48,
    category: "Flavoured Sandesh",
    shape: "peda",
    color: "#f0a830",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    description: "Sweet strawberry sandesh with a rosy pink hue — berry-kissed and impossible to resist.",
    price: 25,
    bestBeforeHours: 48,
    category: "Flavoured Sandesh",
    shape: "peda",
    color: "#e04060",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // ── Special / Day Sweets ───────────────────────────────────────────
  {
    id: "abar-khabo",
    name: "Abar Khabo (Saturday)",
    description: "A Saturday-only special — 'abar khabo' means 'I'll eat again', and once you've tried it, you will.",
    price: 25,
    bestBeforeHours: 12,
    category: "Special",
    shape: "peda",
    color: "#d09040",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "chop",
    name: "Chop (Sunday)",
    description: "A Sunday-only crispy, deep-fried sweet chop — the weekend ritual that loyal customers plan their mornings around.",
    price: 30,
    bestBeforeHours: 24,
    category: "Special",
    shape: "laddu",
    color: "#b07030",
    inStock: true,
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "mangolia-bati",
    name: "Mangolia (Bati)",
    description: "A grand, bowl-shaped sandesh loaded with dry fruits and silver leaf — the centrepiece sweet for celebrations and gifting.",
    price: 60,
    bestBeforeHours: 48,
    category: "Special",
    shape: "gulabjamun",
    color: "#c89040",
    inStock: true,
    featured: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

async function readAll(): Promise<Sweet[]> {
  const storage = useStorage("data");
  const raw = await storage.getItem<Sweet[]>(STORAGE_KEY);
  if (raw == null) {
    // unstorage serializes objects (JSON) and deserializes on read, so pass
    // the value directly — works identically on fs, KV, Blob and S3 drivers.
    await storage.setItem(STORAGE_KEY, SEED);
    return SEED;
  }
  return Array.isArray(raw) ? raw : [];
}

async function writeAll(sweets: Sweet[]): Promise<void> {
  await useStorage("data").setItem(STORAGE_KEY, sweets);
}

export async function listSweets(): Promise<Sweet[]> {
  return readAll();
}

export async function getSweet(id: string): Promise<Sweet | undefined> {
  const sweets = await readAll();
  return sweets.find((s) => s.id === id);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createSweet(input: SweetInput): Promise<Sweet> {
  const sweets = await readAll();
  const now = new Date().toISOString();
  let id = slugify(input.name) || `sweet-${Date.now()}`;
  if (sweets.some((s) => s.id === id)) {
    id = `${id}-${Date.now()}`;
  }
  const sweet: Sweet = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  sweets.push(sweet);
  await writeAll(sweets);
  return sweet;
}

export async function updateSweet(
  id: string,
  patch: Partial<SweetInput>
): Promise<Sweet | undefined> {
  const sweets = await readAll();
  const idx = sweets.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  const updated: Sweet = {
    ...sweets[idx],
    ...patch,
    id: sweets[idx].id,
    createdAt: sweets[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  sweets[idx] = updated;
  await writeAll(sweets);
  return updated;
}

export async function deleteSweet(id: string): Promise<boolean> {
  const sweets = await readAll();
  const next = sweets.filter((s) => s.id !== id);
  if (next.length === sweets.length) return false;
  await writeAll(next);
  return true;
}

export async function listCategories(): Promise<string[]> {
  const sweets = await readAll();
  return [...new Set(sweets.map((s) => s.category))].sort();
}

// ── Reviews ─────────────────────────────────────────────────────────

import type { Review, ReviewInput } from "./types";

const REVIEW_STORAGE_KEY = "reviews";

const SEED_REVIEWS: Review[] = [
  {
    id: "rev-1",
    authorName: "Priya Banerjee",
    authorInitials: "PB",
    rating: 5,
    text: "The Jalbhara here is unlike anything else in Kolkata. The syrup bursts in your mouth and the chhena is always perfectly fresh. My family has been buying from Nakur for three generations — the quality has never dropped.",
    publishedAt: "2026-07-14T10:30:00.000Z",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "rev-2",
    authorName: "Rahul Sen",
    authorInitials: "RS",
    rating: 5,
    text: "If you visit Kolkata and don't try the Karapak Talsash from Nakur, you've missed the best part. The caramelised shell crackles perfectly and the filling is rich without being heavy. Pure artistry.",
    publishedAt: "2026-06-22T14:15:00.000Z",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "rev-3",
    authorName: "Ananya Das",
    authorInitials: "AD",
    rating: 4,
    text: "The Chandrapuli is delicate and beautiful — shaped like a crescent moon with cardamom that lingers on the palate. The shop itself feels like stepping back in time. Only reason for 4 stars is the wait during Durga Puja season!",
    publishedAt: "2026-05-08T09:45:00.000Z",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "rev-4",
    authorName: "Subhash Ghosh",
    authorInitials: "SG",
    rating: 5,
    text: "The Gurer Barfi in winter is a religious experience. The date palm jaggery gives it an earthy depth that you simply cannot find elsewhere. Worth every rupee and worth the trip across the city.",
    publishedAt: "2026-04-18T16:20:00.000Z",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
];

async function readReviews(): Promise<Review[]> {
  const storage = useStorage("data");
  const raw = await storage.getItem<Review[]>(REVIEW_STORAGE_KEY);
  if (raw == null) {
    await storage.setItem(REVIEW_STORAGE_KEY, SEED_REVIEWS);
    return SEED_REVIEWS;
  }
  return Array.isArray(raw) ? raw : [];
}

async function writeReviews(reviews: Review[]): Promise<void> {
  await useStorage("data").setItem(REVIEW_STORAGE_KEY, reviews);
}

export async function listReviews(): Promise<Review[]> {
  return readReviews();
}

export async function getReview(id: string): Promise<Review | undefined> {
  const reviews = await readReviews();
  return reviews.find((r) => r.id === id);
}

export async function createReview(input: ReviewInput): Promise<Review> {
  const reviews = await readReviews();
  const now = new Date().toISOString();
  const id = `rev-${Date.now()}`;
  const review: Review = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  reviews.push(review);
  await writeReviews(reviews);
  return review;
}

export async function updateReview(
  id: string,
  patch: Partial<ReviewInput>
): Promise<Review | undefined> {
  const reviews = await readReviews();
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  const updated: Review = {
    ...reviews[idx],
    ...patch,
    id: reviews[idx].id,
    createdAt: reviews[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  reviews[idx] = updated;
  await writeReviews(reviews);
  return updated;
}

export async function deleteReview(id: string): Promise<boolean> {
  const reviews = await readReviews();
  const next = reviews.filter((r) => r.id !== id);
  if (next.length === reviews.length) return false;
  await writeReviews(next);
  return true;
}
