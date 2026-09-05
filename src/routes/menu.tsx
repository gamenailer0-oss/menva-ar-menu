import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChefHat, Leaf, Minus, Plus, Flame, Clock, X, ScanLine } from "lucide-react";
import { Cheffy, Pill, ScanFrame, SectionLabel, Logo } from "@/components/menva/brand";
import { CATEGORIES, DISHES, RESTAURANT, whatsappLink, type Dish } from "@/lib/menva-data";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Table 12 · Osteria Lume — live AR menu on MENVA" },
      {
        name: "description",
        content:
          "The live MENVA table menu: see each dish in AR, read the chef's story, check allergens and send your order to the kitchen in one tap.",
      },
      { property: "og:title", content: "Osteria Lume — live AR menu" },
      {
        property: "og:description",
        content: "Dishes in augmented reality, chef stories and one-tap ordering.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [open, setOpen] = useState<Dish | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});

  const dishes = useMemo(
    () => (cat === "All" ? DISHES : DISHES.filter((d) => d.category === cat)),
    [cat],
  );

  const items = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ dish: DISHES.find((d) => d.id === id)!, qty }));
  const total = items.reduce((s, i) => s + i.dish.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const add = (id: string, delta: number) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + delta) }));

  return (
    <div className="min-h-screen bg-cream-100 pb-32">
      <header className="sticky top-0 z-30 border-b border-border bg-cream-100/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <Logo />
          <Pill tone="saffron">
            <ScanLine className="h-3 w-3" /> Table {RESTAURANT.table}
          </Pill>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="py-8"
        >
          <SectionLabel>{RESTAURANT.city}</SectionLabel>
          <h1 className="mt-3 font-display text-4xl font-semibold">{RESTAURANT.name}</h1>
          <p className="mt-3 text-sm leading-[1.6] text-charcoal-700/80">
            Tap any dish to see it appear on your table, read where it came from, and send it
            straight to the kitchen.
          </p>
        </motion.section>

        <div className="sticky top-[73px] z-20 -mx-6 flex gap-2 overflow-x-auto bg-cream-100/90 px-6 py-3 backdrop-blur-md">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`label-xs shrink-0 rounded-full px-4 py-2 transition-colors ${
                cat === c
                  ? "bg-saffron-500 text-primary-foreground"
                  : "border border-border bg-card text-charcoal-700/80 hover:border-saffron-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {dishes.map((d) => (
              <motion.article
                key={d.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="card-warm cursor-pointer overflow-hidden transition-shadow hover:shadow-[var(--shadow-warm-lg)]"
                onClick={() => setOpen(d)}
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
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {d.special && (
                      <Pill tone="honey">
                        <ChefHat className="h-3 w-3" /> Chef's special
                      </Pill>
                    )}
                    {d.fresh && (
                      <Pill tone="mint">
                        <span className="h-1.5 w-1.5 rounded-full bg-mint-500" /> Fresh today
                      </Pill>
                    )}
                  </div>
                  <h2 className="dish-name mt-3 text-[22px]">{d.name}</h2>
                  <p className="mt-2 text-sm leading-[1.6] text-charcoal-700/75">{d.blurb}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="price-num text-lg">${d.price}</p>
                    <span className="label-xs text-saffron-700">View in AR →</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {dishes.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Cheffy size={120} />
            <p className="font-display text-xl">Nothing plated in {cat} tonight</p>
            <p className="text-sm text-charcoal-300">Cheffy suggests the Primi instead.</p>
          </div>
        )}
      </main>

      {/* Dish detail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-900/40 backdrop-blur-sm sm:items-center"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-card p-6 shadow-[var(--shadow-warm-float)] sm:rounded-[28px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <SectionLabel>Augmented view</SectionLabel>
                  <h2 className="dish-name mt-2 text-2xl">{open.name}</h2>
                </div>
                <button
                  onClick={() => setOpen(null)}
                  aria-label="Close dish"
                  className="rounded-full border border-border p-2 transition-colors hover:border-saffron-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5">
                <ScanFrame>
                  <img
                    src={open.image}
                    alt={`${open.name} rendered on your table in augmented reality`}
                    width={800}
                    height={800}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                </ScanFrame>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Pill tone="saffron">
                  <Flame className="h-3 w-3" /> {open.kcal} kcal
                </Pill>
                <Pill tone="mint">
                  <Clock className="h-3 w-3" /> {open.minutes} min
                </Pill>
                {open.fresh && (
                  <Pill tone="mint">
                    <Leaf className="h-3 w-3" /> Fresh today
                  </Pill>
                )}
                {open.special && (
                  <Pill tone="honey">
                    <ChefHat className="h-3 w-3" /> Chef's special
                  </Pill>
                )}
              </div>

              <p className="mt-5 text-sm leading-[1.6] text-charcoal-700/80">{open.blurb}</p>

              <blockquote className="mt-6 rounded-lg border-l-2 border-saffron-300 bg-saffron-50 p-6">
                <p className="label-xs text-saffron-700">From the chef</p>
                <p className="mt-2 font-display text-base italic leading-[1.6]">
                  “{open.chefStory}”
                </p>
              </blockquote>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="label-xs text-charcoal-300">On the plate</p>
                  <ul className="mt-2 space-y-1 text-sm leading-[1.6]">
                    {open.ingredients.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label-xs text-charcoal-300">Allergens</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {open.allergens.map((a) => (
                      <span
                        key={a}
                        className="label-xs rounded-sm bg-cream-200 px-2 py-1 text-charcoal-700"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 rounded-md border border-border p-1">
                  <button
                    onClick={() => add(open.id, -1)}
                    aria-label="Remove one"
                    className="rounded-sm p-2 transition-transform active:scale-[0.97]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="price-num w-6 text-center">{cart[open.id] ?? 0}</span>
                  <button
                    onClick={() => add(open.id, 1)}
                    aria-label="Add one"
                    className="rounded-sm p-2 transition-transform active:scale-[0.97]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    add(open.id, 1);
                    setOpen(null);
                  }}
                  className="flex-1 rounded-md bg-saffron-500 px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
                >
                  Add · ${open.price}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order bar */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-4 backdrop-blur-md"
          >
            <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
              <div>
                <p className="label-xs text-charcoal-300">
                  {count} item{count > 1 ? "s" : ""} · Table {RESTAURANT.table}
                </p>
                <p className="price-num font-display text-xl">${total}</p>
              </div>
              <a
                href={whatsappLink(items.map((i) => ({ name: i.dish.name, qty: i.qty })))}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-saffron-500 px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
              >
                Send to the kitchen
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
