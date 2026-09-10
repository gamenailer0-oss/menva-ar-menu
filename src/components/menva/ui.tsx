import { motion, type HTMLMotionProps } from "motion/react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 520, damping: 26, mass: 0.6 };

const base =
  "relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-semibold transition-colors";

const sheen =
  "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/28 before:to-transparent after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.12)]";

export const glossy = {
  primary: cn(base, sheen, "bg-saffron-500 text-primary-foreground shadow-[var(--shadow-warm-lg)]"),
  dark: cn(base, sheen, "bg-charcoal-900 text-cream-50 shadow-[var(--shadow-warm-lg)]"),
  ghost: cn(
    base,
    "bg-cream-50/70 text-charcoal-700 shadow-[inset_0_0_0_1px_var(--color-border)] backdrop-blur-sm",
  ),
  themed: cn(
    base,
    sheen,
    "bg-[var(--rt-accent)] text-[var(--rt-accent-fg)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)]",
  ),
  themedGhost: cn(
    base,
    "text-[var(--rt-fg)] shadow-[inset_0_0_0_1px_var(--rt-line)] hover:bg-[color-mix(in_oklab,var(--rt-fg)_8%,transparent)]",
  ),
};

type Variant = keyof typeof glossy;

export function Press({
  className,
  variant = "primary",
  ...props
}: HTMLMotionProps<"button"> & { variant?: Variant }) {
  return (
    <motion.button
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.955, y: 0 }}
      transition={spring}
      className={cn(glossy[variant], className)}
      {...props}
    />
  );
}

export function PressLink({
  to,
  className,
  variant = "primary",
  children,
  ...rest
}: {
  to: string;
  className?: string;
  variant?: Variant;
  children: React.ReactNode;
  search?: Record<string, unknown>;
  params?: Record<string, string>;
}) {
  return (
    <motion.span
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.955, y: 0 }}
      transition={spring}
      className="inline-flex"
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Link to={to as any} className={cn(glossy[variant], className)} {...(rest as any)}>
        {children}
      </Link>
    </motion.span>
  );
}

export function PressAnchor({
  className,
  variant = "primary",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <motion.a
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.955, y: 0 }}
      transition={spring}
      className={cn(glossy[variant], className)}
      {...(props as HTMLMotionProps<"a">)}
    />
  );
}

export function Chip({
  active,
  className,
  ...props
}: HTMLMotionProps<"button"> & { active?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      transition={spring}
      className={cn(
        "label-xs shrink-0 rounded-full px-4 py-2 transition-colors",
        active
          ? "bg-[var(--rt-accent)] text-[var(--rt-accent-fg)]"
          : "text-[var(--rt-muted)] shadow-[inset_0_0_0_1px_var(--rt-line)]",
        className,
      )}
      {...props}
    />
  );
}
