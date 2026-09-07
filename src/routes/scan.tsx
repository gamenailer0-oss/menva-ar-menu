import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CameraOff, ScanLine } from "lucide-react";
import { Logo, SectionLabel } from "@/components/menva/brand";

export const Route = createFileRoute("/scan")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Scan your table code — MENVA" },
      {
        name: "description",
        content:
          "Point your camera at the MENVA code on your table to open the live menu, see dishes in 3D and order in one tap.",
      },
      { property: "og:title", content: "Scan your table code — MENVA" },
      {
        property: "og:description",
        content: "Open your table's living menu by scanning the code on the table.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScanPage,
});

function tableFromText(text: string) {
  try {
    const url = new URL(text);
    const t = url.searchParams.get("table");
    if (t) return t;
  } catch {
    /* not a url */
  }
  const m = text.match(/\d{1,3}/);
  return m ? m[0] : null;
}

function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    let stop: (() => void) | undefined;
    let done = false;

    (async () => {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current ?? undefined,
          (result) => {
            if (done || !result) return;
            const table = tableFromText(result.getText());
            if (!table) return;
            done = true;
            controls.stop();
            void navigate({ to: "/menu", search: { table } as never });
          },
        );
        stop = () => controls.stop();
      } catch {
        setError(
          "We can't reach your camera. Allow camera access in your browser, or type the number printed under your table code.",
        );
      }
    })();

    return () => {
      done = true;
      stop?.();
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-charcoal-900 text-cream-50">
      <video
        ref={videoRef}
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <Logo className="[&_span]:text-cream-50" />
          <Link to="/menu" className="label-xs text-cream-50/70 underline-offset-4 hover:underline">
            Browse the menu instead
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6">
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm text-center"
            >
              <CameraOff className="mx-auto h-8 w-8 text-saffron-300" />
              <h1 className="mt-4 font-display text-2xl">Camera unavailable</h1>
              <p className="mt-3 text-sm leading-[1.7] text-cream-50/70">{error}</p>
              <form
                className="mt-6 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const table = code.trim();
                  if (table) void navigate({ to: "/menu", search: { table } as never });
                }}
              >
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  placeholder="Table number"
                  aria-label="Table number"
                  className="flex-1 rounded-md border border-cream-50/20 bg-cream-50/10 px-4 py-3 text-sm outline-none placeholder:text-cream-50/40 focus:border-saffron-300"
                />
                <button className="rounded-md bg-saffron-500 px-5 py-3 text-sm font-semibold text-primary-foreground">
                  Open
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="relative aspect-square w-full max-w-[300px]">
              <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-lg border-l-2 border-t-2 border-saffron-500" />
              <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-lg border-r-2 border-t-2 border-saffron-500" />
              <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-lg border-b-2 border-l-2 border-saffron-500" />
              <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-lg border-b-2 border-r-2 border-saffron-500" />
              <span className="scan-sweep" />
            </div>
          )}
        </div>

        {!error && (
          <footer className="px-6 pb-10 text-center">
            <SectionLabel>Point. Discover. Devour.</SectionLabel>
            <p className="mt-2 flex items-center justify-center gap-2 text-sm text-cream-50/70">
              <ScanLine className="h-4 w-4" /> Hold the code inside the frame
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
