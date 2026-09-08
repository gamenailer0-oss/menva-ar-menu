import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useProgress,
  Html,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

function Plate({ image }: { image: string }) {
  const texture = useLoader(THREE.TextureLoader, image);
  texture.colorSpace = THREE.SRGBColorSpace;
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={group}>
      {/* plate base */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.32, 0.12, 96]} />
        <meshPhysicalMaterial color="#f6f1e6" roughness={0.35} clearcoat={0.6} />
      </mesh>
      {/* rim */}
      <mesh position={[0, 0.02, 0]} rotation-x={Math.PI / 2} castShadow>
        <torusGeometry args={[1.44, 0.07, 24, 96]} />
        <meshPhysicalMaterial color="#efe7d6" roughness={0.3} clearcoat={0.8} />
      </mesh>
      {/* the food, photo mapped onto a soft mound */}
      <mesh position={[0, 0.06, 0]} scale={[1, 0.34, 1]} castShadow>
        <sphereGeometry args={[1.05, 96, 96, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial map={texture} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.055, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[1.05, 96]} />
        <meshStandardMaterial map={texture} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function GLBModel({ url, spin = true }: { url: string; spin?: boolean }) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = 2 / Math.max(size.x, size.y, size.z || 1);
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
    wrap.scale.setScalar(scale);
    return wrap;
  }, [scene]);

  useFrame((_, delta) => {
    if (spin && group.current) group.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={group} position={[0, -0.9, 0]}>
      <primitive object={model} />
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <p className="label-xs text-charcoal-300">Plating… {Math.round(progress)}%</p>
    </Html>
  );
}

export default function Dish3D({
  image,
  alt,
  model,
}: {
  image: string;
  alt: string;
  model?: string;
}) {
  return (
    <div
      className="h-[320px] w-full cursor-grab overflow-hidden rounded-xl active:cursor-grabbing"
      role="img"
      aria-label={`Interactive 3D view of ${alt}. Drag to spin, pinch to zoom.`}
    >
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2.2, 3.6], fov: 42 }}>
        <color attach="background" args={["#faf6ee"]} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[3, 6, 3]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Suspense fallback={<Loader />}>
          {model ? <GLBModel url={model} /> : <Plate image={image} />}
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
        <ContactShadows position={[0, -0.14, 0]} opacity={0.4} blur={2.6} scale={8} far={4} />
        <OrbitControls
          enablePan={false}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={2.4}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
}
