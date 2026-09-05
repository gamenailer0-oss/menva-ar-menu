import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/menva/chrome";
import { Cheffy, SectionLabel } from "@/components/menva/brand";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — MENVA AR menus for restaurants" },
      {
        name: "description",
        content:
          "Simple per-venue pricing for MENVA: QR + AR menus, chef stories, allergens and one-tap ordering. Start free with one table.",
      },
      { property: "og:title", content: "MENVA pricing — one plate at a time" },
      {
        property: "og:description",
        content: "Free for one table, flat monthly for the whole dining room.",
      },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Tasting",
    price: "Free",
    note: "One table, forever",
    features: ["1 QR table code", "Up to 10 dishes", "AR dish preview", "Allergen labels"],
    cta: "Start free",
  },
  {
    name: "Service",
    price: "$49",
    note: "per venue / month",
    features: [
      "Unlimited tables & dishes",
      "Chef stories & photography slots",
      "WhatsApp ordering",
      "Live analytics dashboard",
      "Menu edits in seconds",
    ],
    cta: "Open the dashboard",
    featured: true,
  },
  {
    name: "Group",
    price: "$179",
    note: "up to 8 venues",
    features: [
      "Everything in Service",
      "Shared dish library",
      "Per-venue pricing & stock",
      "Priority onboarding with Cheffy",
    ],
    cta: "Talk to us",
  },
];

function Pricing() {
  return (
    <div className="min-h-screen bg-cream-100">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-14 md:py-24">
        <div className="max-w-xl">
          <SectionLabel>Pricing</SectionLabel>
          <h1 className="mt-4 font-display text-4xl font-semibold">
            Priced like a good house wine
          </h1>
          <p className="mt-4 text-base leading-[1.6] text-charcoal-700/80">
            No commission on orders, no per-scan fees. Change your menu as often as your market
            changes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={
                p.featured
                  ? "rounded-xl border border-saffron-300 bg-card p-8 shadow-[var(--shadow-warm-float)]"
                  : "card-warm p-8"
              }
            >
              <p className="label-xs text-saffron-700">{p.name}</p>
              <p className="price-num mt-4 font-display text-4xl">{p.price}</p>
              <p className="mt-1 text-sm text-charcoal-300">{p.note}</p>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm leading-[1.6]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-700" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={p.featured ? "/dashboard" : "/menu"}
                className={
                  p.featured
                    ? "mt-8 block rounded-md bg-saffron-500 px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
                    : "mt-8 block rounded-md border border-border px-5 py-3 text-center text-sm font-semibold hover:border-saffron-300"
                }
              >
                {p.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-xl bg-cream-50 p-10 text-center">
          <Cheffy size={96} />
          <h2 className="font-display text-2xl font-medium">Cheffy sets up your first menu</h2>
          <p className="max-w-md text-sm leading-[1.6] text-charcoal-700/75">
            Send us your current menu as a photo or PDF and we'll have your tables live before
            your next service.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
