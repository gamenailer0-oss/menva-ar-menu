import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ChefHat, QrCode, ScanLine, Sparkles, Leaf, MessageCircle } from "lucide-react";
import { Cheffy, ScanFrame, SectionLabel, Pill } from "@/components/menva/brand";
import { SiteFooter, SiteHeader } from "@/components/menva/chrome";
import { DISHES } from "@/lib/menva-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MENVA — AR menus for restaurants | Point. Discover. Devour." },
      {
        name: "description",
        content:
          "Guests scan the table QR and watch dishes come alive in AR — photos, ingredients, chef stories, allergens and one-tap ordering to the kitchen.",
      },
      { property: "og:title", content: "MENVA — Point. Discover. Devour." },
      {
        property: "og:description",
        content: "The QR + AR menu that turns every table into a chef's table.",
      },
    ],
  }),
  component: Landing,
});

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

const STEPS = [
  {
    icon: QrCode,
    title: "Scan the table code",
    body: "No app, no download. The camera opens your menu in under a second.",
  },
  {
    icon: ScanLine,
    title: "See the dish, life-size",
    body: "Point the phone at the table and the plate appears where it will be served.",
  },
  {
    icon: MessageCircle,
    title: "Send it to the kitchen",
    body: "One tap fires the order straight into your WhatsApp or POS ticket line.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-cream-100">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-14 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <SectionLabel>Menu innovation</SectionLabel>
            <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1.05] md:text-5xl">
              Point. Discover. <em className="text-saffron-500">Devour.</em>
            </h1>
            <p className="mt-5 max-w-md text-base leading-[1.6] text-charcoal-700/80">
              MENVA turns the little code on your table into a chef's table. Every dish arrives
              first in augmented reality — with the story, the produce and the allergens the
              kitchen would tell you itself.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/menu"
                className="rounded-md bg-saffron-500 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm-lg)] transition-transform active:scale-[0.97]"
              >
                Open a live table
              </Link>
              <Link
                to="/dashboard"
                className="rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:border-saffron-300"
              >
                See the owner dashboard
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Pill tone="mint">
                <Leaf className="h-3 w-3" /> Allergens on every plate
              </Pill>
              <Pill tone="honey">
                <ChefHat className="h-3 w-3" /> Chef's stories
              </Pill>
              <Pill tone="saffron">
                <Sparkles className="h-3 w-3" /> No app needed
              </Pill>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[28px] border border-border bg-card p-5 shadow-[var(--shadow-warm-float)]">
              <ScanFrame>
                <img
                  src={DISHES[2].image}
                  alt="Tagliatelle al ragù shown in augmented reality on the table"
                  width={800}
                  height={800}
                  className="aspect-square w-full rounded-lg object-cover"
                />
              </ScanFrame>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <Pill tone="honey">
                    <ChefHat className="h-3 w-3" /> Chef's special
                  </Pill>
                  <h2 className="dish-name mt-2 text-2xl">{DISHES[2].name}</h2>
                  <p className="mt-1 text-sm text-charcoal-300">Table 12 · Osteria Lume</p>
                </div>
                <p className="price-num text-xl">${DISHES[2].price}</p>
              </div>
            </div>
            <Cheffy size={104} className="absolute -bottom-8 -left-6 hidden md:block" />
          </motion.div>
        </section>

        {/* How it works */}
        <section className="bg-cream-50 py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-6">
            <motion.div {...fadeUp}>
              <SectionLabel>Three seconds, start to hungry</SectionLabel>
              <h2 className="mt-3 font-display text-3xl font-medium">How a MENVA table works</h2>
            </motion.div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.title}
                  {...fadeUp}
                  transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.08 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="card-warm p-6 transition-shadow hover:shadow-[var(--shadow-warm-lg)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-saffron-50 text-saffron-700">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-medium">{s.title}</h3>
                  <p className="mt-2 text-sm leading-[1.6] text-charcoal-700/75">{s.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dish preview strip */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Tonight at Osteria Lume</SectionLabel>
              <h2 className="mt-3 font-display text-3xl font-medium">A menu that photographs itself</h2>
            </div>
            <Link to="/menu" className="text-sm font-semibold text-saffron-700 hover:underline">
              Open the full menu →
            </Link>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {DISHES.map((d, i) => (
              <motion.article
                key={d.id}
                {...fadeUp}
                transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.06 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="card-warm overflow-hidden"
              >
                <div className="overflow-hidden">
                  <motion.img
                    src={d.image}
                    alt={d.name}
                    width={800}
                    height={800}
                    loading="lazy"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="aspect-square w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="dish-name text-lg">{d.name}</h3>
                  <p className="price-num mt-1 text-base text-charcoal-300">${d.price}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Owner band */}
        <section className="bg-charcoal-700 py-16 text-cream-100 md:py-24">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
            <motion.div {...fadeUp}>
              <p className="label-xs text-honey-500">For restaurant owners</p>
              <h2 className="mt-3 font-display text-3xl font-medium text-cream-50">
                Run a smarter kitchen without changing how you cook
              </h2>
              <p className="mt-4 max-w-md text-sm leading-[1.6] text-cream-200/80">
                Edit a dish and every table sees it in seconds. Watch which plates get looked at
                but never ordered. Print new QR codes from the dashboard whenever the menu turns.
              </p>
              <Link
                to="/dashboard"
                className="mt-8 inline-flex rounded-md bg-saffron-500 px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Explore the dashboard
              </Link>
            </motion.div>
            <motion.div {...fadeUp} className="grid grid-cols-2 gap-4">
              {[
                { k: "1,731", v: "Scans this week" },
                { k: "+34%", v: "Specials ordered" },
                { k: "12s", v: "Avg. menu decision" },
                { k: "0", v: "Apps to install" },
              ].map((s) => (
                <div key={s.v} className="rounded-lg border border-cream-100/10 bg-cream-100/5 p-6">
                  <p className="price-num font-display text-3xl text-honey-500">{s.k}</p>
                  <p className="label-xs mt-2 text-cream-200/70">{s.v}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
