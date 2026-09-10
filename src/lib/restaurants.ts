import { DISHES, type Dish } from "./menva-data";
import entremet from "@/assets/olmec-entremet.jpg";
import cheesecake from "@/assets/olmec-cheesecake.jpg";
import millefeuille from "@/assets/olmec-millefeuille.jpg";
import cake from "@/assets/olmec-cake.jpg";
import eclair from "@/assets/olmec-eclair.jpg";
import burgerGlb from "@/assets/burger.glb.asset.json";
import burgerUsdz from "@/assets/burger-ar.usdz.asset.json";

export type RestaurantTheme = {
  bg: string;
  surface: string;
  fg: string;
  muted: string;
  accent: string;
  accentFg: string;
  line: string;
  display: string;
};

export type Restaurant = {
  slug: string;
  name: string;
  tagline: string;
  kind: string;
  region: string;
  city: string;
  story: string;
  chefNote: string;
  hours: string;
  monogram: string;
  whatsapp: string;
  socials: { instagram: string; tiktok: string; site: string };
  google: { rating: number; reviews: number };
  menvaScore: number;
  mark?: boolean;
  theme: RestaurantTheme;
  categories: string[];
  dishes: Dish[];
  loyalty: { stamps: number; reward: string };
};

const OLMEC_DISHES: Dish[] = [
  {
    id: "verdant",
    name: "Verdant Royale",
    category: "Signature" as Dish["category"],
    price: 18,
    blurb:
      "Sicilian pistachio mousse over a salted praline base, sealed under a mirror glaze poured at 32 degrees.",
    chefStory:
      "We pour the glaze once. There is no second attempt — the shine you see is the first and only pour of the morning.",
    ingredients: ["Bronte pistachio", "Single-origin white chocolate", "Praline", "Gold leaf"],
    allergens: ["Milk", "Nuts", "Egg"],
    kcal: 410,
    minutes: 4,
    image: entremet,
    signature: true,
    model: burgerGlb.url,
    usdz: burgerUsdz.url,
    views: 6120,
    orders: 2240,
  },
  {
    id: "basque",
    name: "Matcha Basque",
    category: "Signature" as Dish["category"],
    price: 12,
    blurb: "Ceremonial-grade matcha baked hot and fast until the top turns to dark caramel.",
    chefStory: "Burnt is the point. Underneath it stays liquid — that contrast is the whole dessert.",
    ingredients: ["Uji matcha", "Cream cheese", "Cream", "Egg"],
    allergens: ["Milk", "Egg", "Gluten"],
    kcal: 380,
    minutes: 3,
    image: cheesecake,
    special: true,
    views: 3980,
    orders: 1610,
  },
  {
    id: "jade",
    name: "Jade Mille-Feuille",
    category: "Pastry" as Dish["category"],
    price: 14,
    blurb: "Two hundred and fifty-six layers, pistachio crème légère, lacquered green top.",
    chefStory: "Six folds over two days. Rush a single one and the layers close up on you.",
    ingredients: ["Butter puff", "Pistachio crème", "Vanilla", "Matcha lacquer"],
    allergens: ["Gluten", "Milk", "Nuts", "Egg"],
    kcal: 440,
    minutes: 5,
    image: millefeuille,
    views: 2740,
    orders: 890,
  },
  {
    id: "thyme",
    name: "Olive Oil & Thyme",
    category: "Cakes" as Dish["category"],
    price: 9,
    blurb: "Cold-pressed olive oil cake, thyme syrup, a glaze that stays just barely soft.",
    chefStory: "The most honest thing we bake. Four ingredients, nowhere to hide.",
    ingredients: ["Olive oil", "Thyme", "00 flour", "Lemon"],
    allergens: ["Gluten", "Egg"],
    kcal: 320,
    minutes: 3,
    image: cake,
    fresh: true,
    views: 1880,
    orders: 720,
  },
  {
    id: "cardamom",
    name: "Green Cardamom Éclair",
    category: "Pastry" as Dish["category"],
    price: 8,
    blurb: "Choux baked dark, cardamom crème pâtissière, a glaze polished like stone.",
    chefStory: "We grind the cardamom at four in the morning so the oil is still in the seed.",
    ingredients: ["Choux", "Green cardamom", "Crème pâtissière", "Cocoa butter"],
    allergens: ["Gluten", "Milk", "Egg"],
    kcal: 290,
    minutes: 3,
    image: eclair,
    views: 2110,
    orders: 940,
  },
];

export const RESTAURANTS: Restaurant[] = [
  {
    slug: "olmec",
    name: "Olmec",
    tagline: "Premium delights, one shade of green",
    kind: "Dessert bakery",
    region: "Lahore",
    city: "Gulberg, Lahore",
    story:
      "Olmec bakes in a single colour. Every case, every plate, every wall sits somewhere between deep forest and pale sage — so the only thing that changes across the counter is the pastry itself.",
    chefNote:
      "I wanted one colour and no decoration to hide behind. What is left is temperature, timing and the pistachio.",
    hours: "Tue–Sun · 11:00 – 23:00",
    monogram: "OL",
    whatsapp: "15551234567",
    socials: { instagram: "@olmec.bakery", tiktok: "@olmec", site: "olmec.cafe" },
    google: { rating: 4.9, reviews: 1284 },
    menvaScore: 96,
    mark: true,
    theme: {
      bg: "#0d1a13",
      surface: "#132218",
      fg: "#e8f0e6",
      muted: "#9db39c",
      accent: "#a8c66c",
      accentFg: "#0d1a13",
      line: "rgba(232,240,230,0.12)",
      display: '"Fraunces", Georgia, serif',
    },
    categories: ["All", "Signature", "Pastry", "Cakes"],
    dishes: OLMEC_DISHES,
    loyalty: { stamps: 8, reward: "Day eight: a surprise AR dessert, made only for that visit." },
  },
  {
    slug: "osteria-lume",
    name: "Osteria Lume",
    tagline: "Fire, flour and patience",
    kind: "Italian fine dining",
    region: "Milano",
    city: "Brera, Milano",
    story:
      "A twenty-four seat room in Brera where the ragù starts before service and never boils, and the pasta is rolled at six in the morning.",
    chefNote: "Low heat is the only secret we have, and we give it away freely.",
    hours: "Wed–Sun · 18:30 – 23:30",
    monogram: "OL",
    whatsapp: "15551234567",
    socials: { instagram: "@osterialume", tiktok: "@osterialume", site: "osterialume.it" },
    google: { rating: 4.7, reviews: 862 },
    menvaScore: 91,
    theme: {
      bg: "#faf4e8",
      surface: "#fffdf7",
      fg: "#3d405b",
      muted: "#8b8ba0",
      accent: "#e07a5f",
      accentFg: "#ffffff",
      line: "rgba(61,64,91,0.10)",
      display: '"Fraunces", Georgia, serif',
    },
    categories: ["All", "Antipasti", "Primi", "Secondi", "Dolci"],
    dishes: DISHES,
    loyalty: { stamps: 8, reward: "Day eight: the chef's off-menu plate, in AR before it arrives." },
  },
];

/** Directory-only entries — real listings arrive with each restaurant's own menu. */
export const DIRECTORY_TEASERS = [
  { name: "Kaya House", kind: "Modern Korean", region: "Karachi", score: 88, rating: 4.6 },
  { name: "Sel & Sable", kind: "Coastal French", region: "Dubai", score: 87, rating: 4.5 },
  { name: "Rooftop No. 9", kind: "Contemporary grill", region: "Lahore", score: 84, rating: 4.4 },
];

export function getRestaurant(slug: string) {
  return RESTAURANTS.find((r) => r.slug === slug);
}

export function themeVars(t: RestaurantTheme): React.CSSProperties {
  return {
    ["--rt-bg" as string]: t.bg,
    ["--rt-surface" as string]: t.surface,
    ["--rt-fg" as string]: t.fg,
    ["--rt-muted" as string]: t.muted,
    ["--rt-accent" as string]: t.accent,
    ["--rt-accent-fg" as string]: t.accentFg,
    ["--rt-line" as string]: t.line,
    ["--rt-display" as string]: t.display,
  };
}

export function whatsappOrder(r: Restaurant, items: { name: string; qty: number }[], table: string) {
  const lines = items.map((i) => `${i.qty} x ${i.name}`).join("%0A");
  return `https://wa.me/${r.whatsapp}?text=${encodeURIComponent(`Table ${table} at ${r.name}`)}%0A%0A${lines}`;
}
