import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, ChefHat, QrCode, Store, UtensilsCrossed } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/menva/chrome";
import { Cheffy, Pill, ScanFrame, SectionLabel } from "@/components/menva/brand";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your restaurant — MENVA onboarding in 3 steps" },
      {
        name: "description",
        content:
          "Name your restaurant, add your first dishes and print table QR codes. MENVA gets a living AR menu on your tables in minutes.",
      },
      { property: "og:title", content: "Set up your restaurant on MENVA" },
      {
        property: "og:description",
        content: "Three short steps: your place, your first dishes, your table codes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const STEPS = [
  { icon: Store, title: "Your place", hint: "Name, city and the number on your tables." },
  { icon: UtensilsCrossed, title: "First dishes", hint: "Three plates are enough to open." },
  { icon: QrCode, title: "Table codes", hint: "Print, place, and you are live." },
] as const;

type Dish = { name: string; price: string };

function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [tables, setTables] = useState("12");
  const [dishes, setDishes] = useState<Dish[]>([
    { name: "", price: "" },
    { name: "", price: "" },
    { name: "", price: "" },
  ]);

  const canContinue =
    step === 0
      ? name.trim().length > 1 && city.trim().length > 1
      : step === 1
        ? dishes.some((d) => d.name.trim().length > 1)
        : true;

  const field =
    "mt-2 w-full rounded-md border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-saffron-300";

  return (
    <div className="min-h-screen bg-cream-100">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
        <SectionLabel>Owner setup</SectionLabel>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          Let&apos;s get your menu on the table
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-[1.7] text-charcoal-700/75">
          Three short steps. Nothing here is permanent — you can change every word later from the
          kitchen dashboard.
        </p>

        <ol className="mt-10 grid gap-3 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className={`card-warm p-5 transition-colors ${
                i === step ? "border-saffron-300" : ""
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-md ${
                  i < step ? "bg-mint-50 text-mint-700" : "bg-saffron-50 text-saffron-700"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </span>
              <p className="dish-name mt-3 text-base">{s.title}</p>
              <p className="label-xs mt-1 text-charcoal-300">{s.hint}</p>
            </li>
          ))}
        </ol>

        <motion.section
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="card-warm mt-6 p-6 md:p-8"
        >
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="label-xs text-charcoal-300">Restaurant name</span>
                <input
                  className={field}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Osteria Lume"
                />
              </label>
              <label className="block">
                <span className="label-xs text-charcoal-300">City or neighbourhood</span>
                <input
                  className={field}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Brera, Milano"
                />
              </label>
              <label className="block">
                <span className="label-xs text-charcoal-300">How many tables</span>
                <input
                  className={field}
                  value={tables}
                  inputMode="numeric"
                  onChange={(e) => setTables(e.target.value.replace(/\D/g, ""))}
                  placeholder="12"
                />
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              {dishes.map((d, i) => (
                <div key={i} className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                  <input
                    className={field}
                    value={d.name}
                    onChange={(e) =>
                      setDishes((all) =>
                        all.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
                      )
                    }
                    placeholder={`Dish ${i + 1}`}
                  />
                  <input
                    className={`${field} price-num`}
                    value={d.price}
                    inputMode="decimal"
                    onChange={(e) =>
                      setDishes((all) =>
                        all.map((x, j) =>
                          j === i ? { ...x, price: e.target.value.replace(/[^\d.]/g, "") } : x,
                        ),
                      )
                    }
                    placeholder="Price"
                  />
                </div>
              ))}
              <p className="label-xs text-charcoal-300">
                Photos, chef stories and allergens come next, in the dashboard.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <Pill tone="mint">
                  <ChefHat className="h-3 w-3" /> Ready to serve
                </Pill>
                <h2 className="mt-3 font-display text-2xl font-medium">
                  {name || "Your restaurant"} is set
                </h2>
                <p className="mt-2 text-sm leading-[1.7] text-charcoal-700/75">
                  {tables || "12"} table codes are queued for {city || "your dining room"}. Print
                  the sheet, drop one on each table, and every scan opens the live menu.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/dashboard"
                    className="rounded-md bg-saffron-500 px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
                  >
                    Open the dashboard
                  </Link>
                  <Link
                    to="/menu"
                    className="rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:border-saffron-300"
                  >
                    Preview a table
                  </Link>
                </div>
              </div>
              <div className="w-full max-w-[220px] justify-self-center">
                <ScanFrame>
                  <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-card">
                    <QrCode className="h-24 w-24 text-charcoal-700" />
                  </div>
                </ScanFrame>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="label-xs rounded-full px-4 py-2 text-charcoal-300 transition-colors disabled:opacity-40"
            >
              Back
            </button>
            {step < 2 && (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canContinue}
                className="rounded-md bg-charcoal-700 px-5 py-3 text-sm font-semibold text-cream-50 transition-transform active:scale-[0.97] disabled:opacity-40"
              >
                Continue
              </button>
            )}
          </div>
        </motion.section>

        <div className="mt-10 flex items-center gap-4 rounded-xl bg-cream-50 p-6">
          <Cheffy size={72} />
          <p className="text-sm leading-[1.7] text-charcoal-700/75">
            Cheffy will keep an eye on your first service and tell you which plate guests linger on
            the longest.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
