import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Html, useProgress } from "@react-three/drei";
import {
  createXRStore,
  XR,
  XRDomOverlay,
  XRSpace,
  useXRHitTest,
  useXRAnchor,
  useXR,
} from "@react-three/xr";
import * as THREE from "three";
import QRCode from "qrcode";
import { X, Smartphone, RotateCcw, Loader2 } from "lucide-react";

/** Real-world width of the plated burger, in metres. */
const REAL_WIDTH = 0.14;

type Support = "checking" | "xr" | "ios" | "none";

function detectIOS() {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.maxTouchPoints > 1 && /Mac/.test(ua));
}

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

/** The burger, normalised so it sits on y=0 at true table size. */
function ArModel({ url, scale, rotation }: { url: string; scale: number; rotation: number }) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    clone.position.set(-center.x, -box.min.y, -center.z);
    clone.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    const wrap = new THREE.Group();
    wrap.add(clone);
    wrap.scale.setScalar(REAL_WIDTH / Math.max(size.x, size.z || 1));
    return wrap;
  }, [scene]);

  return (
    <group scale={scale} rotation-y={rotation}>
      <primitive object={object} />
    </group>
  );
}

const matrixHelper = new THREE.Matrix4();

/** Ring marker that rides the detected surface until the guest taps to place. */
function Reticle({
  onHit,
  visible,
}: {
  onHit: (result: XRHitTestResult | null) => void;
  visible: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const found = useRef(false);

  useXRHitTest(
    (results, getWorldMatrix) => {
      const hit = results[0];
      if (hit == null) {
        if (found.current) {
          found.current = false;
          onHit(null);
        }
        return;
      }
      if (getWorldMatrix(matrixHelper, hit) && ref.current) {
        ref.current.visible = visible;
        matrixHelper.decompose(ref.current.position, ref.current.quaternion, new THREE.Vector3());
      }
      if (!found.current) {
        found.current = true;
        onHit(hit);
      } else {
        onHit(hit);
      }
    },
    "viewer",
    ["plane", "mesh"],
  );

  useFrame(() => {
    if (ref.current && !visible) ref.current.visible = false;
  });

  return (
    <group ref={ref} visible={false}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.075, 0.095, 48]} />
        <meshBasicMaterial color="#f6a723" transparent opacity={0.9} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.001}>
        <circleGeometry args={[0.075, 48]} />
        <meshBasicMaterial color="#f6a723" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function Scene({
  name,
  model,
  placed,
  setPlaced,
  scale,
  setScale,
  rotation,
  setRotation,
}: {
  name: string;
  model: string;
  placed: boolean;
  setPlaced: (v: boolean) => void;
  scale: number;
  setScale: (v: number) => void;
  rotation: number;
  setRotation: (v: number) => void;
}) {
  const [anchor, createAnchor] = useXRAnchor();
  const [fallback, setFallback] = useState<THREE.Matrix4 | null>(null);
  const [surface, setSurface] = useState(false);
  const session = useXR((s) => s.session);
  const hitRef = useRef<XRHitTestResult | null>(null);
  const placedRef = useRef(placed);
  placedRef.current = placed;

  const place = useRef(() => {});
  place.current = () => {
    const hit = hitRef.current;
    if (!hit || placedRef.current) return;
    const snapshot = new THREE.Matrix4().copy(matrixHelper);
    setFallback(snapshot);
    createAnchor({ relativeTo: "hit-test-result", hitTestResult: hit }).catch(() => undefined);
    setPlaced(true);
  };

  // A tap anywhere in the session (a WebXR "select") sets the plate down.
  useEffect(() => {
    if (!session) return;
    const onSelect = () => place.current();
    session.addEventListener("select", onSelect);
    return () => session.removeEventListener("select", onSelect);
  }, [session]);

  const content = (
    <Suspense fallback={<Loading />}>
      <ArModel url={model} scale={scale} rotation={rotation} />
      <mesh rotation-x={-Math.PI / 2} position-y={0.0005} receiveShadow>
        <circleGeometry args={[REAL_WIDTH * 0.9, 48]} />
        <shadowMaterial opacity={0.28} />
      </mesh>
    </Suspense>
  );

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[1, 3, 1]} intensity={2} castShadow />
      <Reticle
        visible={!placed}
        onHit={(r) => {
          hitRef.current = r;
          setSurface(r != null);
        }}
      />
      {placed && anchor && <XRSpace space={anchor}>{content}</XRSpace>}
      {placed && !anchor && fallback && (
        <group
          position={new THREE.Vector3().setFromMatrixPosition(fallback)}
          quaternion={new THREE.Quaternion().setFromRotationMatrix(fallback)}
        >
          {content}
        </group>
      )}
      <XRDomOverlay>
        <ArOverlay
          name={name}
          placed={placed}
          surface={surface}
          scale={scale}
          setScale={setScale}
          rotation={rotation}
          setRotation={setRotation}
          onPlace={() => place.current()}
          onReset={() => {
            setPlaced(false);
            setRotation(0);
            setScale(1);
          }}
          onExit={() => session?.end()}
        />
      </XRDomOverlay>
    </>
  );
}

/** Controls and guidance drawn over the live AR session. */
function ArOverlay({
  name,
  placed,
  surface,
  scale,
  setScale,
  rotation,
  setRotation,
  onPlace,
  onReset,
  onExit,
}: {
  name: string;
  placed: boolean;
  surface: boolean;
  scale: number;
  setScale: (v: number) => void;
  rotation: number;
  setRotation: (v: number) => void;
  onPlace: () => void;
  onReset: () => void;
  onExit: () => void;
}) {
  const drag = useRef<{ x: number; rot: number } | null>(null);
  const pinch = useRef<{ dist: number; scale: number } | null>(null);

  return (
    <div className="fixed inset-0 select-none text-cream-50">
      {/* gesture layer over the placed plate */}
      <div
        className="absolute inset-0 touch-none"
        onTouchStart={(e) => {
          if (!placed) return;
          if (e.touches.length === 2) {
            const [a, b] = [e.touches[0]!, e.touches[1]!];
            pinch.current = { dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), scale };
          } else if (e.touches[0]) {
            drag.current = { x: e.touches[0].clientX, rot: rotation };
          }
        }}
        onTouchMove={(e) => {
          if (!placed) return;
          if (e.touches.length === 2 && pinch.current) {
            const [a, b] = [e.touches[0]!, e.touches[1]!];
            const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
            setScale(Math.min(2.5, Math.max(0.4, (pinch.current.scale * d) / pinch.current.dist)));
          } else if (drag.current && e.touches[0]) {
            setRotation(drag.current.rot + (e.touches[0].clientX - drag.current.x) * 0.012);
          }
        }}
        onTouchEnd={() => {
          drag.current = null;
          pinch.current = null;
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <div className="rounded-2xl bg-charcoal-900/55 px-4 py-3 backdrop-blur-sm">
          <p className="label-xs text-saffron-300">On your table</p>
          <p className="mt-1 font-display text-xl italic">{name}</p>
        </div>
        <div className="pointer-events-auto flex gap-2">
          {placed && (
            <button
              onClick={onReset}
              aria-label="Place it somewhere else"
              className="rounded-full bg-charcoal-900/60 p-3 backdrop-blur-sm active:scale-[0.94]"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={onExit}
            aria-label="Leave AR"
            className="rounded-full bg-charcoal-900/60 p-3 backdrop-blur-sm active:scale-[0.94]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 pb-10 text-center">
        <p className="label-xs mx-auto inline-block rounded-full bg-charcoal-900/65 px-4 py-2 backdrop-blur-sm">
          {placed
            ? "Walk around it · drag to spin · pinch to resize"
            : surface
              ? "Tap to set it down on the table"
              : "Move your phone slowly to find the table"}
        </p>
        {!placed && surface && (
          <button
            onClick={onPlace}
            className="mx-auto block w-full max-w-sm rounded-full bg-saffron-500 px-6 py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.97]"
          >
            Put it on the table
          </button>
        )}
      </div>
    </div>
  );
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
  const store = useMemo(() => createXRStore({ hand: false, controller: false }), []);
  const [support, setSupport] = useState<Support>("checking");
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
      let ok = false;
      try {
        ok = (await xr?.isSessionSupported("immersive-ar")) ?? false;
      } catch {
        ok = false;
      }
      if (!alive) return;
      setSupport(ok ? "xr" : detectIOS() && usdz ? "ios" : "none");
    })();
    return () => {
      alive = false;
    };
  }, [usdz]);

  useEffect(() => {
    if (support !== "none") return;
    QRCode.toDataURL(window.location.href, {
      width: 320,
      margin: 1,
      color: { dark: "#2b2c3d", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(null));
  }, [support]);

  const start = async () => {
    setError(null);
    try {
      const session = await store.enterAR();
      if (!session) {
        setError("Your phone turned the AR session down. Check camera permission and try again.");
        return;
      }
      setActive(true);
      setPlaced(false);
      session.addEventListener("end", () => {
        setActive(false);
        onClose();
      });
    } catch {
      setError("Camera access was blocked, so AR can't start. Allow the camera and try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-charcoal-900 text-cream-50">
      {support === "xr" && (
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 1.4, 1.6], fov: 50 }}
          gl={{ alpha: true }}
          style={{ background: "transparent" }}
        >
          <XR store={store}>
            <Scene
              name={name}
              model={model}
              placed={placed}
              setPlaced={setPlaced}
              scale={scale}
              setScale={setScale}
              rotation={rotation}
              setRotation={setRotation}
            />
          </XR>
        </Canvas>
      )}

      {!active && (
        <div className="absolute inset-0 flex flex-col justify-between bg-charcoal-900 p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-xs text-saffron-300">Augmented reality</p>
              <h2 className="mt-1 font-display text-3xl italic">{name}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close AR"
              className="rounded-full bg-cream-50/10 p-3 transition-transform active:scale-[0.94]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-auto w-full max-w-sm space-y-5 text-center">
            {support === "checking" && (
              <p className="label-xs flex items-center justify-center gap-2 text-cream-50/70">
                <Loader2 className="h-4 w-4 animate-spin" /> Checking what your device can do…
              </p>
            )}

            {support === "xr" && (
              <>
                <p className="text-[15px] leading-[1.75] text-cream-50/75">
                  Point your phone at the table. When the ring appears, tap it and the burger sits
                  there at <em className="font-display italic">real size</em> — walk around it and
                  it stays put.
                </p>
                {error && <p className="label-xs text-saffron-300">{error}</p>}
                <button
                  onClick={start}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-saffron-500 px-6 py-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
                >
                  <Smartphone className="h-4 w-4" /> Start AR on your table
                </button>
              </>
            )}

            {support === "ios" && usdz && (
              <>
                <p className="text-[15px] leading-[1.75] text-cream-50/75">
                  Your iPhone places the plate with Apple's own AR viewer: it finds the table,
                  anchors the burger at real size and lets you walk around it.
                </p>
                <a
                  href={usdz}
                  rel="ar"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-saffron-500 px-6 py-4 text-sm font-semibold text-primary-foreground"
                >
                  <Smartphone className="h-4 w-4" /> Place it on your table
                </a>
              </>
            )}

            {support === "none" && (
              <>
                <p className="text-[15px] leading-[1.75] text-cream-50/75">
                  This device can't anchor objects to a real table. Open this dish on a phone and
                  the burger will land on your table for real.
                </p>
                {qr && (
                  <img
                    src={qr}
                    alt="QR code that opens this dish on your phone"
                    className="mx-auto h-40 w-40 rounded-lg"
                  />
                )}
                <button
                  onClick={onClose}
                  className="label-xs w-full rounded-full border border-cream-50/20 px-6 py-3.5 text-cream-50"
                >
                  Back to the dish in 3D
                </button>
              </>
            )}
          </div>
          <div />
        </div>
      )}
    </div>
  );
}
