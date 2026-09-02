import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// -- Camera Keyframes ----------------------------------------------------------
const CAMERA_KF = [
  { p: 0.00, pos: [0.0, 0.35, 4.8], at: [0.0, 0.00, 0], fov: 28 },
  { p: 0.15, pos: [3.2, 0.40, 3.8], at: [0.8, -0.05, 0], fov: 24 },
  { p: 0.30, pos: [-2.6, -1.00, 3.2], at: [-0.4, 0.80, 0], fov: 26 },
  { p: 0.45, pos: [-1.6, 0.60, 2.1], at: [-0.5, 0.10, 0], fov: 18 },
  { p: 0.60, pos: [2.2, 3.40, 3.4], at: [-0.6, -0.80, 0], fov: 28 },
  { p: 0.75, pos: [1.2, -2.00, 1.8], at: [0.3, 0.70, 0], fov: 16 },
  { p: 0.90, pos: [0.0, 0.45, 6.8], at: [0.0, 0.00, 0], fov: 26 },
  { p: 1.00, pos: [0.0, 0.35, 7.2], at: [0.0, 0.00, 0], fov: 27 },
];

function interpCamera(progress: number) {
  let lo = CAMERA_KF[0];
  let hi = CAMERA_KF[CAMERA_KF.length - 1];
  for (let i = 0; i < CAMERA_KF.length - 1; i++) {
    if (progress >= CAMERA_KF[i].p && progress <= CAMERA_KF[i + 1].p) {
      lo = CAMERA_KF[i];
      hi = CAMERA_KF[i + 1];
      break;
    }
  }
  const range = hi.p - lo.p;
  const raw = range === 0 ? 1 : (progress - lo.p) / range;
  const t = raw * raw * (3 - 2 * raw);

  return {
    pos: lo.pos.map((v, i) => v + (hi.pos[i] - v) * t) as [number, number, number],
    at: lo.at.map((v, i) => v + (hi.at[i] - v) * t) as [number, number, number],
    fov: lo.fov + (hi.fov - lo.fov) * t,
  };
}

function CameraRig({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const { camera } = useThree();
  const curPos = useRef(new THREE.Vector3(0, 0.35, 4.8));
  const curAt = useRef(new THREE.Vector3(0, 0.0, 0));
  const tgtPos = useRef(new THREE.Vector3(0, 0.35, 4.8));
  const tgtAt = useRef(new THREE.Vector3(0, 0.0, 0));
  const tgtFov = useRef(28);

  useFrame((_s, delta) => {
    const kf = interpCamera(scrollProgress);
    tgtPos.current.set(...kf.pos);
    tgtAt.current.set(...kf.at);
    tgtFov.current = kf.fov;

    const sp = Math.min(delta * 3.5, 1);
    curPos.current.lerp(tgtPos.current, sp);
    curAt.current.lerp(tgtAt.current, sp);

    camera.position.copy(curPos.current);
    camera.lookAt(curAt.current);

    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - tgtFov.current) > 0.05) {
      camera.fov += (tgtFov.current - camera.fov) * sp;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

function classifyMesh(_name: string, index: number) {
  if (index === 0) return 'basket';
  if (index === 21) return 'panel';
  if (index >= 22 && index <= 23) return 'detail';
  if (index >= 24) return 'handle';
  const localIdx = (index - 1) % 5;
  if (localIdx === 2) return 'caster_tire';
  if (localIdx === 3) return 'caster_wheel';
  return 'caster_body';
}

function SideLogoBadges({ matDetail }: { matDetail: THREE.Material }) {
  const logoTexture = useTexture('/assets/logo.jpeg');

  return (
    <group name="side_logos">
      {/* Right Outer Side Wall Logo Badge */}
      {/* <group position={[0.54, 0.22, -0.05]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, -0.004]}>
          <boxGeometry args={[0.36, 0.18, 0.008]} />
          <primitive object={matDetail} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[0.34, 0.16]} />
          <meshStandardMaterial map={logoTexture} roughness={0.2} metalness={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group> */}

      {/* Left Outer Side Wall Logo Badge */}
      <group position={[-0.54, 0.22, -0.05]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0, -0.004]}>
          <boxGeometry args={[0.36, 0.18, 0.008]} />
          <primitive object={matDetail} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[0.34, 0.16]} />
          <meshStandardMaterial map={logoTexture} roughness={0.2} metalness={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Front Display Screen Brand Badge */}
      {/* <group position={[0.0, 0.38, 0.42]} rotation={[-0.2, 0, 0]}>
        <mesh position={[0, 0, -0.004]}>
          <boxGeometry args={[0.26, 0.12, 0.008]} />
          <primitive object={matDetail} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[0.24, 0.10]} />
          <meshStandardMaterial map={logoTexture} roughness={0.2} metalness={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group> */}
    </group>
    
  );
}

interface RealStepCartModelProps {
  activeComponent?: string | null;
  rotationY?: number;
  rotationX?: number;
  scale?: number;
  colorway?: 'light' | 'dark';
  renderMode?: 'pbr' | 'wireframe' | 'xray';
  showDimensions?: boolean;
  scrollProgress?: number;
}

export function RealStepCartModel({
  activeComponent = null,
  rotationY = 0.35,
  rotationX = 0.05,
  scale = 1.0,
  colorway = 'light',
  renderMode = 'pbr',
  showDimensions = false,
  scrollProgress = 0,
}: RealStepCartModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [cadData, setCadData] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const userRot = useRef({ y: 0, x: 0 });
  const dragStart = useRef({ x: 0, y: 0, rotY: 0, rotX: 0 });

  const isDark = colorway === 'dark';
  const isWireframe = renderMode === 'wireframe';
  const isXray = renderMode === 'xray';

  const CENTER = useMemo(() => new THREE.Vector3(-277.74, 0, 571.54), []);
  const SCALE = 1.8 / 1228.31;

  useEffect(() => {
    fetch('/cart-geometry.json')
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(setCadData)
      .catch((e) => {
        console.error('cart-geometry.json error:', e);
        setLoadError(true);
      });
  }, []);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (scrollProgress > 0.08) return;
      const target = e.target as HTMLElement;
      if (target?.closest('button') || target?.closest('a')) return;
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        rotY: userRot.current.y,
        rotX: userRot.current.x,
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = (e.clientX - dragStart.current.x) * 0.006;
      const deltaY = (e.clientY - dragStart.current.y) * 0.004;
      userRot.current.y = dragStart.current.rotY + deltaX;
      userRot.current.x = Math.max(-0.4, Math.min(0.5, dragStart.current.rotX + deltaY));
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, scrollProgress]);

  // Authentic Metallic & Slate Titanium Materials (Brilliant in both Dark and Light Studio Views)
  const mat = useMemo(() => {
    const wire = isWireframe;
    const xT = isXray;
    const xOp = isXray ? 0.32 : 1.0;
    const mk = (color: string, m = 0.5, r = 0.4, extra = {}) =>
      new THREE.MeshStandardMaterial({ color, metalness: m, roughness: r, wireframe: wire, transparent: xT, opacity: xOp, ...extra });

    return {
      basket: mk('#cbd5e1', 0.6, 0.35),                           // Authentic silver/slate steel basket
      panel: mk('#1e293b', 0.2, 0.2),                             // Dark slate screen bezel
      caster_wheel: mk('#e2e8f0', 0.7, 0.2),                      // Chrome wheel rim
      caster_tire: mk('#1a1a1c', 0.0, 0.9),                       // Dark rubber tire
      caster_body: mk('#94a3b8', 0.6, 0.3),                       // Steel caster frame
      handle: mk('#334155', 0.15, 0.6),                           // Dark handle grip
      detail: mk('#64748b', 0.6, 0.3),                            // Titanium metal details
      highlight: new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 0.8,
        metalness: 0.4,
        roughness: 0.2,
        wireframe: wire,
      }),
      dim_line: new THREE.MeshBasicMaterial({ color: '#94a3b8' }),
    };
  }, [isDark, isWireframe, isXray]);

  const meshObjects = useMemo(() => {
    if (!cadData?.meshes) return [];
    return cadData.meshes.map((md: any, i: number) => {
      const geo = new THREE.BufferGeometry();
      const posArr = new Float32Array(md.attributes.position.array);
      geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      if (md.attributes.normal?.array?.length > 0) {
        geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(md.attributes.normal.array), 3));
      } else {
        geo.computeVertexNormals();
      }
      if (md.index?.array?.length > 0) {
        geo.setIndex(new THREE.BufferAttribute(new Uint32Array(md.index.array), 1));
      }
      geo.translate(-CENTER.x, -CENTER.y, -CENTER.z);
      return { id: 'cad-' + i, geo, role: classifyMesh(md.name, i) };
    });
  }, [cadData, CENTER]);

  useFrame((_s, delta) => {
    if (!groupRef.current) return;

    const userInfluence = Math.max(0, 1 - scrollProgress * 12);
    const targetY = rotationY + userRot.current.y * userInfluence;
    const targetX = rotationX + userRot.current.x * userInfluence;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 5.0, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 5.0, delta);
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        {meshObjects.map((obj: any) => {
          const m = activeComponent === obj.role ? mat.highlight : ((mat as any)[obj.role] || mat.detail);
          return <mesh key={obj.id} geometry={obj.geo} material={m} scale={[SCALE, SCALE, SCALE]} castShadow receiveShadow />;
        })}
      </group>

      {/* TrollyWise Outer Side & Front Logo Badges */}
      <React.Suspense fallback={null}>
        <SideLogoBadges matDetail={mat.detail} />
      </React.Suspense>

      {showDimensions && (
        <group name="dim_layer">
          <mesh position={[0, -0.95, 0]} material={mat.dim_line}>
            <cylinderGeometry args={[0.003, 0.003, 1.76, 8]} />
          </mesh>
          <mesh position={[1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mat.dim_line}>
            <cylinderGeometry args={[0.003, 0.003, 1.8, 8]} />
          </mesh>
        </group>
      )}

      {!cadData && !loadError && (
        <mesh>
          <boxGeometry args={[0.6, 0.8, 0.5]} />
          <meshStandardMaterial color="#64748b" wireframe />
        </mesh>
      )}
    </group>
  );
}

export interface Cart3DProps {
  activeComponent?: string | null;
  rotationY?: number;
  rotationX?: number;
  colorway?: 'light' | 'dark';
  enableFloat?: boolean;
  renderMode?: 'pbr' | 'wireframe' | 'xray';
  showDimensions?: boolean;
  scrollProgress?: number;
  enableScrollRig?: boolean;
  enableControls?: boolean;
}

export default function Cart3D({
  activeComponent = null,
  rotationY = 0.35,
  rotationX = 0.05,
  colorway = 'dark',
  enableFloat = true,
  renderMode = 'pbr',
  showDimensions = false,
  scrollProgress = 0,
  enableScrollRig = false,
  enableControls = true,
}: Cart3DProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: '300px' }}>
      <Canvas
        camera={{ position: [0.0, 0.35, 4.8], fov: 28, near: 0.1, far: 50 }}
        style={{ background: 'transparent', touchAction: 'pan-y' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
      >
        {enableScrollRig && <CameraRig scrollProgress={scrollProgress} />}
        {enableControls && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} makeDefault />}

        {/* Crisp Neutral Studio Lighting (Pure White Studio) */}
        <ambientLight intensity={colorway === 'dark' ? 1.35 : 1.8} color="#ffffff" />
        <directionalLight position={[4, 6, 4]} intensity={colorway === 'dark' ? 2.0 : 2.2} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 3, -3]} intensity={colorway === 'dark' ? 0.7 : 1.0} color="#f1f5f9" />
        <pointLight position={[0, -1.5, 1]} intensity={0.5} color="#ffffff" />

        {enableFloat ? (
          <Float speed={1.3} rotationIntensity={0.07} floatIntensity={0.12}>
            <RealStepCartModel
              activeComponent={activeComponent}
              rotationY={rotationY}
              rotationX={rotationX}
              colorway={colorway}
              renderMode={renderMode}
              showDimensions={showDimensions}
              scrollProgress={scrollProgress}
            />
          </Float>
        ) : (
          <RealStepCartModel
            activeComponent={activeComponent}
            rotationY={rotationY}
            rotationX={rotationX}
            colorway={colorway}
            renderMode={renderMode}
            showDimensions={showDimensions}
            scrollProgress={scrollProgress}
          />
        )}

        <ContactShadows
          position={[0, -1.08, 0]}
          opacity={colorway === 'dark' ? 0.35 : 0.25}
          scale={6}
          blur={2.5}
          far={3.5}
          color={colorway === 'dark' ? '#090d16' : '#64748b'}
        />
      </Canvas>
    </div>
  );
}
