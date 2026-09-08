import pasta from "@/assets/dish-pasta.jpg";
import salad from "@/assets/dish-salad.jpg";
import scallops from "@/assets/dish-scallops.jpg";
import tart from "@/assets/dish-tart.jpg";
import burger from "@/assets/dish-burger.jpg";
import burgerGlb from "@/assets/burger.glb.asset.json";
import burgerUsdz from "@/assets/burger.usdz.asset.json";

export type Dish = {
  id: string;
  name: string;
  category: "Antipasti" | "Primi" | "Secondi" | "Dolci";
  price: number;
  blurb: string;
  chefStory: string;
  ingredients: string[];
  allergens: string[];
  kcal: number;
  minutes: number;
  image: string;
  fresh?: boolean;
  special?: boolean;
  signature?: boolean;
  model?: string;
  usdz?: string;
  views: number;
  orders: number;
};

export const RESTAURANT = {
  name: "Osteria Lume",
  table: "12",
  whatsapp: "15551234567",
  city: "Brera, Milano",
};

export const DISHES: Dish[] = [
  {
    id: "royale",
    name: "La Fiamma Royale",
    category: "Secondi",
    price: 28,
    blurb:
      "Dry-aged wagyu over oak embers, aged cheddar melted to a slow gold, burnt-honey onions, brioche brushed with beef fat.",
    chefStory:
      "Our signature. One patty, one fire, one minute of patience — the flame does the seasoning and we simply stay out of its way.",
    ingredients: ["Dry-aged wagyu", "24-month cheddar", "Burnt-honey onion", "Brioche", "Smoked aioli"],
    allergens: ["Gluten", "Milk", "Egg", "Mustard"],
    kcal: 890,
    minutes: 16,
    image: burger,
    model: burgerGlb.url,
    usdz: burgerUsdz.url,
    signature: true,
    special: true,
    views: 5210,
    orders: 1880,
  },
  {
    id: "burrata",
    name: "Heirloom & Burrata",
    category: "Antipasti",
    price: 14,
    blurb:
      "Sun-warm heirloom tomatoes, hand-torn burrata, basil oil pressed the same morning.",
    chefStory:
      "My grandmother grew four tomato varieties on a Ligurian balcony. This plate is her balcony, rebuilt every summer.",
    ingredients: ["Heirloom tomato", "Burrata", "Genovese basil", "Sea salt", "Cold-press olive oil"],
    allergens: ["Milk"],
    kcal: 320,
    minutes: 8,
    image: salad,
    fresh: true,
    views: 1284,
    orders: 386,
  },
  {
    id: "scallops",
    name: "Scallops, Citrus, Sea Herbs",
    category: "Antipasti",
    price: 22,
    blurb: "Hand-dived scallops seared 40 seconds a side, finished with yuzu and sea purslane.",
    chefStory:
      "Learned in a six-seat Tokyo counter: touch the scallop once, turn it once, then leave it alone.",
    ingredients: ["Hokkaido scallop", "Yuzu", "Sea purslane", "Brown butter"],
    allergens: ["Molluscs", "Milk"],
    kcal: 280,
    minutes: 11,
    image: scallops,
    special: true,
    views: 2140,
    orders: 512,
  },
  {
    id: "ragu",
    name: "Tagliatelle al Ragù",
    category: "Primi",
    price: 19,
    blurb: "Eight-hour ragù, egg tagliatelle rolled at 6am, basil from the window box.",
    chefStory:
      "The ragù starts before service and never boils. Low heat is the only secret we have and we give it away freely.",
    ingredients: ["00 flour", "Egg yolk", "Beef shin", "San Marzano", "Parmigiano 24m"],
    allergens: ["Gluten", "Egg", "Milk"],
    kcal: 640,
    minutes: 14,
    image: pasta,
    special: true,
    views: 3410,
    orders: 1204,
  },
  {
    id: "tart",
    name: "Chocolate & Olive Oil Tart",
    category: "Dolci",
    price: 11,
    blurb: "Dark chocolate ganache, Sicilian olive oil, flaked salt, cold berries.",
    chefStory:
      "Dessert should taste like the end of a long dinner: dark, a little salty, and slow.",
    ingredients: ["70% chocolate", "Olive oil", "Butter pastry", "Maldon salt", "Blueberry"],
    allergens: ["Gluten", "Milk", "Egg", "Soy"],
    kcal: 470,
    minutes: 6,
    image: tart,
    views: 1890,
    orders: 640,
  },
];

export const CATEGORIES = ["All", "Antipasti", "Primi", "Secondi", "Dolci"] as const;

export const WEEK_SCANS = [
  { day: "Mon", scans: 128, orders: 74 },
  { day: "Tue", scans: 156, orders: 91 },
  { day: "Wed", scans: 174, orders: 104 },
  { day: "Thu", scans: 212, orders: 132 },
  { day: "Fri", scans: 348, orders: 241 },
  { day: "Sat", scans: 412, orders: 296 },
  { day: "Sun", scans: 301, orders: 188 },
];

export function whatsappLink(items: { name: string; qty: number }[]) {
  const lines = items.map((i) => `${i.qty} x ${i.name}`).join("%0A");
  const text = `Table ${RESTAURANT.table} at ${RESTAURANT.name}%0A%0A${lines}`;
  return `https://wa.me/${RESTAURANT.whatsapp}?text=${text}`;
}
