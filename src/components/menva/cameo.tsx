import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import cheffy from "@/assets/cheffy.png";
import { cn } from "@/lib/utils";

export const CAMEO_TOTAL = 8;
const KEY = "menva.cameos";

type Ctx = { found: string[]; find: (id: string) => void; reset: () => void };
const CameoContext = createContext<Ctx>({ found: [], find: () => {}, reset: () => {} });

export function CameoProvider({ children }: { children: React.ReactNode }) {
  const [found, setFound] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFound(JSON.parse(raw) as string[]);
    } catch {
      /* first visit */
    }
  }, []);

  const find = useCallback((id: string) => {
    setFound((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* private mode */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setFound([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return <CameoContext.Provider value={{ found, find, reset }}>{children}</CameoContext.Provider>;
}

export const useCameos = () => useContext(CameoContext);

/**
 * A small Cheffy cameo. Tapping it counts towards the easter-egg hunt.
 * `pose` only changes how he sits on the page — he is never a talking assistant.
 */
export function Cameo({
  id,
  pose = "peek",
  size = 88,
  className,
  hint,
}: {
  id: string;
  pose?: "peek" | "drool" | "sleep" | "lean";
  size?: number;
  className?: string;
  hint?: string;
}) {
  const { found, find } = useCameos();
  const got = found.includes(id);
  const [pop, setPop] = useState(false);

  const poses: Record<string, string> = {
    peek: "translate-y-3",
    drool: "-rotate-6",
    sleep: "rotate-90 opacity-70",
    lean: "rotate-3",
  };

  return (
    <span className={cn("pointer-events-none absolute select-none", className)}>
      <motion.button
        type="button"
        aria-label={hint ?? "A hidden Cheffy"}
        onClick={() => {
          find(id);
          setPop(true);
          window.setTimeout(() => setPop(false), 1400);
        }}
        whileHover={{ y: -6, rotate: 0 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className={cn(
          "pointer-events-auto block cursor-pointer",
          poses[pose],
          got ? "opacity-100" : "opacity-90",
        )}
      >
        <img
          src={cheffy}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          style={{ width: size, height: size }}
          className="drop-shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
        />
      </motion.button>
      <AnimatePresence>
        {pop && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: -14 }}
            className="label-xs pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-charcoal-900 px-3 py-1.5 text-cream-50"
          >
            {got ? "Found already" : "Cheffy spotted!"}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function CameoCounter({ className }: { className?: string }) {
  const { found, reset } = useCameos();
  const done = found.length >= CAMEO_TOTAL;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="label-xs opacity-70">
        Cheffy hunt · {found.length}/{CAMEO_TOTAL}
      </span>
      <span className="flex gap-1">
        {Array.from({ length: CAMEO_TOTAL }).map((_, i) => (
          <motion.span
            key={i}
            animate={{ scale: i < found.length ? 1 : 0.7 }}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              i < found.length ? "bg-saffron-500" : "bg-current opacity-25",
            )}
          />
        ))}
      </span>
      {done && (
        <button onClick={reset} className="label-xs text-saffron-700 hover:underline">
          All found · play again
        </button>
      )}
    </div>
  );
}
