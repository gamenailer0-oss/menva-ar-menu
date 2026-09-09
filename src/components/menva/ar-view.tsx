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
      if (results.length === 0 || results[0] == null) {
        if (found.current) {
          found.current = false;
          onHit(null);
        }
        return;
      }
      const hit = results[0];
      if (getWorldMatrix(matrixHelper, hit) && ref.current) {
        ref.current.visible = visible;
        matrixHelper.decompose(ref.current.position, ref.current.quaternion, new THREE.Vector3());
      }
      if (!found.current) found.current = true;
      onHit(hit);
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
  model,
  placed,
  setPlaced,
  hitRef,
  scale,
  rotation,
  requestPlace,
}: {
  model: string;
  placed: boolean;
  setPlaced: (v: boolean) => void;
  hitRef: React.MutableRefObject<XRHitTestResult | null>;
  scale: number;
  rotation: number;
  requestPlace: React.MutableRefObject<(() => void) | null>;
}) {
  const [anchor, createAnchor] = useXRAnchor();
  const [fallback, setFallback] = useState<THREE.Matrix4 | null>(null);
  const [surface, setSurface] = useState(false);
  const session = useXR((s) => s.session);

  const place = useRef(() => {});
  place.current = () => {
    const hit = hitRef.current;
    if (!hit) return;
    createAnchor({ relativeTo: "hit-test-result", hitTestResult: hit })
      .then((a) => {
        if (!a) setFallback(new THREE.Matrix4().copy(matrixHelper));
      })
      .catch(() => setFallback(new THREE.Matrix4().copy(matrixHelper)));
    setPlaced(true);
  };

  useEffect(() => {
    requestPlace.current = () => place.current();
    return () => {
      requestPlace.current = null;
    };
  }, [requestPlace]);

  // Tapping the screen inside the session also places / moves the plate.
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
        <ArOverlay placed={placed} surface={surface} />
      </XRDomOverlay>
    </>
  );
}

/** Hint text drawn over the live AR session. */
function ArOverlay({ placed, surface }: { placed: boolean; surface: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 p-6 pb-10 text-center">
      <p className="label-xs mx-auto max-w-xs rounded-full bg-charcoal-900/65 px-4 py-2 text-cream-50 backdrop-blur-sm">
        {placed
          ? "Walk around it · drag to spin · pinch to resize"
          : surface
            ? "Tap the ring to set it down on the table"
            : "Move your phone slowly to find the table"}
      </p>
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
  const hitRef = useRef<XRHitTestResult | null>(null);
  const requestPlace = useRef<(() => void) | null>(null);
  const gesture = useRef<{ x: number; rot: number; dist: number; scale: number } | null>(null);

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
      {/* Live AR canvas — transparent, the real room shows through */}
      {support === "xr" && (
        <div
          className="absolute inset-0 touch-none"
          onPointerDown={(e) => {
            gesture.current = { x: e.clientX, rot: rotation, dist: 0, scale };
          }}
          onPointerMove={(e) => {
            if (gesture.current && placed)
              setRotation(gesture.current.rot + (e.clientX - gesture.current.x) * 0.012);
          }}
          onPointerUp={() => {
            gesture.current = null;
          }}
        >
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 1.4, 1.6], fov: 50 }}
            gl={{ alpha: true }}
            style={{ background: "transparent" }}
          >
            <XR store={store}>
              <Scene
                model={model}
                placed={placed}
                setPlaced={setPlaced}
                hitRef={hitRef}
                scale={scale}
                rotation={rotation}
                requestPlace={requestPlace}
              />
            </XR>
          </Canvas>
        </div>
      )}

      {/* Pre-session / unsupported panel */}
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
                  Point your phone at the table. When the ring appears, tap it and the burger will
                  sit there at <em className="font-display italic">real size</em> — walk around it
                  and it stays put.
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
                  Your iPhone places the plate with Apple's own AR viewer. It finds the table,
                  anchors the burger at real size and lets you walk around it.
                </p>
                <a
                  href={usdz}
                  rel="ar"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-saffron-500 px-6 py-4 text-sm font-semibold text-primary-foreground"
                >
                  <Smartphone className="h-4 w-4" /> Place it on your table
                  {/* Quick Look requires an image child */}
                  <img src="" alt="" className="hidden" />
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

      {/* In-session controls */}
      {active && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
          <div className="pointer-events-auto max-w-[60%] rounded-2xl bg-charcoal-900/55 px-4 py-3 backdrop-blur-sm">
            <p className="label-xs text-saffron-300">On your table</p>
            <p className="mt-1 font-display text-xl italic">{name}</p>
          </div>
          <div className="pointer-events-auto flex gap-2">
            {placed && (
              <button
                onClick={() => {
                  setPlaced(false);
                  setRotation(0);
                  setScale(1);
                }}
                aria-label="Place it somewhere else"
                className="rounded-full bg-charcoal-900/60 p-3 backdrop-blur-sm active:scale-[0.94]"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => store.getState().session?.end()}
              aria-label="Leave AR"
              className="rounded-full bg-charcoal-900/60 p-3 backdrop-blur-sm active:scale-[0.94]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {active && placed && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-24 mx-auto flex w-full max-w-sm items-center gap-4 px-6">
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.01}
            value={scale}
            aria-label="Plate size"
            onChange={(e) => setScale(Number(e.target.value))}
            className="h-1 w-full accent-saffron-500"
          />
        </div>
      )}
    </div>
  );
}
