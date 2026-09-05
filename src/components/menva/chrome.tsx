import { Link } from "@tanstack/react-router";
import { Logo } from "./brand";

const NAV = [
  { to: "/menu", label: "Live menu" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream-100/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-charcoal-700/80 transition-colors hover:text-saffron-700"
              activeProps={{ className: "text-saffron-700" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/menu"
          className="rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)] transition-transform active:scale-[0.97]"
        >
          Try a table
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal-300">
            Point. Discover. Devour. Menus that come alive at the table.
          </p>
        </div>
        <nav className="flex flex-wrap gap-6">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-charcoal-700/80 hover:text-saffron-700">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="label-xs border-t border-border px-6 py-5 text-center text-charcoal-300">
        © {new Date().getFullYear()} MENVA · Menu Innovation
      </p>
    </footer>
  );
}
