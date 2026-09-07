import { lazy, Suspense, useMemo, useState } from "react";
import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X, ScanLine } from "lucide-react";
import { Logo } from "@/components/menva/brand";
import { Reveal } from "@/components/menva/motion";
import { CATEGORIES, DISHES, RESTAURANT, whatsappLink, type Dish } from "@/lib/menva-data";

const Dish3D = lazy(() => import("@/components/menva/dish-3d"));

export const Route = createFileRoute("/menu")({
  validateSearch: (search: Record<string, unknown>) => ({
    table: typeof search['table'] === "string" ? (search['table'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Osteria Lume — the living table menu on MENVA" },
      {
        name: "description",
        content:
          "The live MENVA table menu: spin each dish in 3D, read the chef's story, check allergens and send your order to the kitchen in one tap.",
      },
      { property: "og:title", content: "Osteria Lume — living table menu" },
      {
        property: "og:description",
        content: "Dishes in 3D, chef stories and one-tap ordering.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { table } = Route.useSearch();
  const tableNo = table ?? RESTAURANT.table;
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
      <header className="sticky top-0 z-30 bg-cream-100/85 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <Logo />
          <Link to="/scan" className="label-xs flex items-center gap-2 text-saffron-700">
            <ScanLine className="h-3.5 w-3.5" /> Table {tableNo}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6">
        <section className="py-14">
          <Reveal>
            <p className="label-xs text-charcoal-300">{RESTAURANT.city}</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-6xl">
              {RESTAURANT.name}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-[1.75] text-charcoal-700/75">
              Tonight's plates, written the way the kitchen thinks about them. Open any dish to spin
              it in <em className="font-display italic">three dimensions</em>, read where it came
              from, and send it straight to the pass.
            </p>
          </Reveal>
        </section>

        <div className="sticky top-[68px] z-20 -mx-6 flex gap-6 overflow-x-auto bg-cream-100/85 px-6 py-3 backdrop-blur-md">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`label-xs shrink-0 pb-1 transition-colors ${
                cat === c
                  ? "border-b-2 border-saffron-500 text-saffron-700"
                  : "border-b-2 border-transparent text-charcoal-300 hover:text-charcoal-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <AnimatePresence mode="popLayout">
            {dishes.map((d, i) => (
              <motion.article
                key={d.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setOpen(d)}
                className="group grid cursor-pointer grid-cols-[96px_1fr] items-start gap-6 py-9 sm:grid-cols-[160px_1fr] sm:gap-10"
              >
                <div className="overflow-hidden rounded-full">
                  <motion.img
                    src={d.image}
                    alt={d.name}
                    width={640}
                    height={640}
                    loading="lazy"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="aspect-square w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-6">
                    <h2 className="dish-name text-[26px] leading-tight sm:text-[30px]">{d.name}</h2>
                    <p className="price-num shrink-0 text-base text-charcoal-700">${d.price}</p>
                  </div>
                  {(d.special || d.fresh) && (
                    <p className="label-xs mt-2 text-saffron-700">
                      {d.special ? "Chef's special" : "Fresh today"}
                    </p>
                  )}
                  <p className="mt-3 max-w-lg text-[15px] leading-[1.75] text-charcoal-700/75">
                    {d.blurb}
                  </p>
                  <p className="label-xs mt-4 text-charcoal-300">
                    {d.allergens.join(" · ")} — {d.kcal} kcal · {d.minutes} min
                  </p>
                  <span className="label-xs mt-4 inline-block text-charcoal-700 transition-colors group-hover:text-saffron-700">
                    See it in 3D →
                  </span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Dish detail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-900/45 backdrop-blur-sm sm:items-center"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ y: 28, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-cream-50 p-7 shadow-[var(--shadow-warm-float)] sm:rounded-[28px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="label-xs text-saffron-700">Spin · pinch to zoom</p>
                  <h2 className="dish-name mt-2 text-3xl">{open.name}</h2>
                </div>
                <button
                  onClick={() => setOpen(null)}
                  aria-label="Close dish"
                  className="rounded-full p-2 text-charcoal-300 transition-colors hover:text-charcoal-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl bg-cream-100">
                <ClientOnly
                  fallback={
                    <img
                      src={open.image}
                      alt={open.name}
                      className="h-[320px] w-full object-cover"
                    />
                  }
                >
                  <Suspense
                    fallback={
                      <img
                        src={open.image}
                        alt={open.name}
                        className="h-[320px] w-full object-cover"
                      />
                    }
                  >
                    <Dish3D image={open.image} alt={open.name} />
                  </Suspense>
                </ClientOnly>
              </div>

              <p className="mt-6 text-[15px] leading-[1.75] text-charcoal-700/80">{open.blurb}</p>

              <blockquote className="mt-7 border-l-2 border-saffron-300 pl-5">
                <p className="label-xs text-saffron-700">From the chef</p>
                <p className="mt-2 font-display text-[17px] italic leading-[1.65]">
                  “{open.chefStory}”
                </p>
              </blockquote>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="label-xs text-charcoal-300">On the plate</p>
                  <ul className="mt-2 space-y-1 text-[15px] leading-[1.7]">
                    {open.ingredients.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label-xs text-charcoal-300">Allergens</p>
                  <p className="label-xs mt-2 leading-[1.9] text-charcoal-700">
                    {open.allergens.join(" · ")}
                  </p>
                  <p className="label-xs mt-4 text-charcoal-300">
                    {open.kcal} kcal · {open.minutes} min
                  </p>
                </div>
              </div>

              <div className="mt-9 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => add(open.id, -1)}
                    aria-label="Remove one"
                    className="rounded-full p-2 text-charcoal-300 transition-transform active:scale-[0.94] hover:text-charcoal-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="price-num w-6 text-center">{cart[open.id] ?? 0}</span>
                  <button
                    onClick={() => add(open.id, 1)}
                    aria-label="Add one"
                    className="rounded-full p-2 text-charcoal-300 transition-transform active:scale-[0.94] hover:text-charcoal-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    add(open.id, 1);
                    setOpen(null);
                  }}
                  className="flex-1 rounded-full bg-saffron-500 px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
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
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 bg-cream-50/95 p-4 shadow-[var(--shadow-warm-float)] backdrop-blur-md"
          >
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
              <div>
                <p className="label-xs text-charcoal-300">
                  {count} item{count > 1 ? "s" : ""} · Table {tableNo}
                </p>
                <p className="price-num font-display text-xl">${total}</p>
              </div>
              <a
                href={whatsappLink(items.map((i) => ({ name: i.dish.name, qty: i.qty })))}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-saffron-500 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
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
