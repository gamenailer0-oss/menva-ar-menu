import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { TableQR } from "@/components/menva/qr-code";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChefHat, Eye, QrCode, ShoppingBag, TrendingUp } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/menva/chrome";
import { Cheffy, Pill, SectionLabel } from "@/components/menva/brand";
import { DISHES, RESTAURANT, WEEK_SCANS, type Dish } from "@/lib/menva-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Owner dashboard — MENVA restaurant menu & analytics" },
      {
        name: "description",
        content:
          "Manage dishes, availability and table QR codes, and see which plates guests look at, linger on and order.",
      },
      { property: "og:title", content: "MENVA owner dashboard" },
      {
        property: "og:description",
        content: "Menu management, table QR codes and live scan-to-order analytics.",
      },
    ],
  }),
  component: Dashboard,
});

const TABS = ["Overview", "Menu", "Tables"] as const;

function Dashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [dishes, setDishes] = useState<(Dish & { live: boolean })[]>(
    DISHES.map((d) => ({ ...d, live: true })),
  );

  const scans = WEEK_SCANS.reduce((s, d) => s + d.scans, 0);
  const orders = WEEK_SCANS.reduce((s, d) => s + d.orders, 0);

  const stats = [
    { icon: Eye, label: "Scans this week", value: scans.toLocaleString() },
    { icon: ShoppingBag, label: "Orders sent", value: orders.toLocaleString() },
    {
      icon: TrendingUp,
      label: "Scan → order",
      value: `${Math.round((orders / scans) * 100)}%`,
    },
    { icon: ChefHat, label: "Live dishes", value: `${dishes.filter((d) => d.live).length}` },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel>{RESTAURANT.name}</SectionLabel>
            <h1 className="mt-3 font-display text-4xl font-semibold">Kitchen dashboard</h1>
          </div>
          <Pill tone="mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-500" /> Menu live on 18 tables
          </Pill>
        </div>

        <div className="mt-8 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`label-xs rounded-full px-4 py-2 transition-colors ${
                tab === t
                  ? "bg-charcoal-700 text-cream-50"
                  : "border border-border bg-card hover:border-saffron-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-8 space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="card-warm p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-saffron-50 text-saffron-700">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <p className="price-num mt-4 font-display text-3xl">{s.value}</p>
                  <p className="label-xs mt-1 text-charcoal-300">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="card-warm p-6">
              <h2 className="font-display text-xl font-medium">Scans and orders, last 7 days</h2>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={WEEK_SCANS}>
                    <defs>
                      <linearGradient id="scansFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-saffron-500)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-saffron-500)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-mint-500)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-mint-500)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--color-border)",
                        background: "var(--color-card)",
                        fontSize: 13,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      stroke="var(--color-saffron-500)"
                      strokeWidth={2}
                      fill="url(#scansFill)"
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="var(--color-mint-500)"
                      strokeWidth={2}
                      fill="url(#ordersFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-warm p-6">
              <h2 className="font-display text-xl font-medium">Most looked at</h2>
              <div className="mt-5 space-y-4">
                {[...dishes]
                  .sort((a, b) => b.views - a.views)
                  .map((d) => (
                    <div key={d.id} className="flex items-center gap-4">
                      <img
                        src={d.image}
                        alt={d.name}
                        width={800}
                        height={800}
                        loading="lazy"
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="dish-name truncate text-base">{d.name}</p>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-cream-200">
                          <div
                            className="h-1.5 rounded-full bg-saffron-500"
                            style={{ width: `${(d.views / 3410) * 100}%` }}
                          />
                        </div>
                      </div>
                      <p className="price-num w-16 text-right text-sm text-charcoal-300">
                        {d.views}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === "Menu" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-8 grid gap-4 md:grid-cols-2"
          >
            {dishes.map((d) => (
              <div key={d.id} className="card-warm flex gap-4 p-6">
                <img
                  src={d.image}
                  alt={d.name}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="h-24 w-24 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="label-xs text-charcoal-300">{d.category}</p>
                  <h3 className="dish-name mt-1 truncate text-lg">{d.name}</h3>
                  <p className="price-num mt-1 text-sm">${d.price}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() =>
                        setDishes((all) =>
                          all.map((x) => (x.id === d.id ? { ...x, live: !x.live } : x)),
                        )
                      }
                      className={`label-xs rounded-full px-3 py-1.5 transition-colors ${
                        d.live
                          ? "bg-mint-50 text-mint-700"
                          : "bg-cream-200 text-charcoal-300"
                      }`}
                    >
                      {d.live ? "On the menu" : "86'd"}
                    </button>
                    <span className="label-xs text-charcoal-300">{d.orders} orders</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === "Tables" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-8"
          >
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 18 }, (_, i) => i + 1).map((t) => (
                <div
                  key={t}
                  className="flex flex-col items-center gap-3 rounded-xl bg-card p-5 shadow-[var(--shadow-warm)]"
                >
                  <TableQR table={String(t)} size={120} />
                  <p className="label-xs text-charcoal-300">Table {t}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center gap-4 rounded-xl bg-cream-50 p-10 text-center">
              <Cheffy size={96} />
              <h2 className="font-display text-2xl font-medium">Need more codes?</h2>
              <p className="max-w-sm text-sm leading-[1.6] text-charcoal-700/75">
                Print a fresh sheet whenever you add tables — every code points at the same live
                menu, so nothing goes stale.
              </p>
              <button className="rounded-md bg-saffron-500 px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]">
                Print QR sheet
              </button>
            </div>
          </motion.div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
