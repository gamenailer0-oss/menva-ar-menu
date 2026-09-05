import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import cheffy from "@/assets/cheffy.png";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <img src={cheffy} alt="Cheffy, the MENVA mascot" width={36} height={36} className="h-9 w-9" />
      <span className="font-display text-xl font-semibold tracking-[-0.02em]">MENVA</span>
    </Link>
  );
}

export function Cheffy({
  size = 160,
  className,
  float = true,
}: {
  size?: number;
  className?: string;
  float?: boolean;
}) {
  return (
    <img
      src={cheffy}
      alt="Cheffy, the winking chef mascot of MENVA"
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
      className={cn(float && "float-slow", className)}
    />
  );
}

export function Pill({
  tone = "mint",
  children,
}: {
  tone?: "mint" | "honey" | "saffron";
  children: React.ReactNode;
}) {
  const tones = {
    mint: "bg-mint-50 text-mint-700",
    honey: "bg-honey-100 text-charcoal-700",
    saffron: "bg-saffron-50 text-saffron-700",
  };
  return (
    <span
      className={cn(
        "label-xs inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="label-xs text-saffron-700">{children}</p>;
}

export function ScanFrame({ children }: { children?: React.ReactNode }) {
  const corner =
    "absolute h-8 w-8 border-saffron-500/70";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl bg-cream-50 p-6"
    >
      <span className={cn(corner, "left-3 top-3 rounded-tl-md border-l-2 border-t-2")} />
      <span className={cn(corner, "right-3 top-3 rounded-tr-md border-r-2 border-t-2")} />
      <span className={cn(corner, "bottom-3 left-3 rounded-bl-md border-b-2 border-l-2")} />
      <span className={cn(corner, "bottom-3 right-3 rounded-br-md border-b-2 border-r-2")} />
      <span className="scan-sweep" />
      {children}
    </motion.div>
  );
}
