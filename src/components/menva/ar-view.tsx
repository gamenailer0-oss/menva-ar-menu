import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Html, useProgress } from "@react-three/drei";
import { X, RotateCcw, Smartphone } from "lucide-react";
import { GLBModel } from "./dish-3d";

function Loading() {
  const { progress } = useProgress();
  return (
    <Html center>
      <p className="label-xs whitespace-nowrap text-cream-50">
        Serving your plate… {Math.round(progress)}%
      </p>
    </Html>
  );
}

function nativeArHref(model: string, usdz?: string) {
  if (typeof window === "undefined") return null;
  const origin = window.location.origin;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.maxTouchPoints > 1 && /Mac/.test(ua));
  if (isIOS && usdz) return origin + usdz;
  if (/Android/.test(ua)) {
    const file = encodeURIComponent(origin + model);
    return `intent://arvr.google.com/scene-viewer/1.0?file=${file}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
      window.location.href,
    )};end;`;
  }
  return null;
}

export default function ARView({
  name,
  model,
  usdz,
  onClose,
}: {
  name: string;
  model: string;
  usdz?: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [native, setNative] = useState<string | null>(null);
  const drag = useRef<{ x: number; rot: number } | null>(null);

  useEffect(() => setNative(nativeArHref(model, usdz)), [model, usdz]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setError("Camera access is blocked, so the plate is floating on a dark table instead.");
      }
    })();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-charcoal-900">
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0 touch-none"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, rot: rotation };
        }}
        onPointerMove={(e) => {
          if (drag.current) setRotation(drag.current.rot + (e.clientX - drag.current.x) * 0.01);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
      >
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.4, 3.4], fov: 45 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 6, 3]} intensity={1.8} castShadow />
          <Suspense fallback={<Loading />}>
            <group rotation-y={rotation} scale={scale} position={[0, -0.4, 0]}>
              <GLBModel url={model} spin={false} />
            </group>
            <Environment>
              <Lightformer intensity={2} position={[0, 5, 2]} scale={[8, 8, 1]} />
              <Lightformer
                intensity={1}
                color="#ffd9b0"
                position={[-5, 2, -1]}
                rotation-y={Math.PI / 2}
                scale={[16, 2, 1]}
              />
            </Environment>
          </Suspense>
          <ContactShadows position={[0, -1.3, 0]} opacity={0.5} blur={2.6} scale={9} far={5} />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <div className="pointer-events-auto max-w-[62%]">
          <p className="label-xs text-saffron-300">On your table</p>
          <h2 className="mt-1 font-display text-2xl italic text-cream-50">{name}</h2>
          {error && <p className="label-xs mt-2 leading-relaxed text-cream-50/70">{error}</p>}
        </div>
        <button
          onClick={onClose}
          aria-label="Close the table view"
          className="pointer-events-auto rounded-full bg-charcoal-900/60 p-3 text-cream-50 backdrop-blur-sm transition-transform active:scale-[0.94]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 space-y-4 bg-gradient-to-t from-charcoal-900/80 to-transparent p-6 pb-8">
        <div className="mx-auto flex w-full max-w-sm items-center gap-4">
          <RotateCcw className="h-4 w-4 shrink-0 text-cream-50/70" />
          <input
            type="range"
            min={0.4}
            max={2.2}
            step={0.01}
            value={scale}
            aria-label="Plate size"
            onChange={(e) => setScale(Number(e.target.value))}
            className="h-1 w-full accent-saffron-500"
          />
        </div>
        <p className="label-xs text-center text-cream-50/70">Drag to spin · slide to resize</p>
        {native && (
          <a
            href={native}
            rel="ar"
            className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-saffron-500 px-6 py-3.5 text-sm font-semibold text-primary-foreground"
          >
            <Smartphone className="h-4 w-4" /> Anchor it to the real table
          </a>
        )}
      </div>
    </div>
  );
}
