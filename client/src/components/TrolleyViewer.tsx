import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  const { scene } = useGLTF('/assets/shopping_cart.glb');

  // Automatically compute bounding box to center and scale the model perfectly
  const { clonedScene, targetScale, centerOffset } = useMemo(() => {
    const clone = scene.clone(true);
    
    // Compute exact bounding box
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Target a normalized height of ~2.2 world units
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDimension > 0 ? 2.2 / maxDimension : 1.0;

    return {
      clonedScene: clone,
      targetScale: scaleFactor,
      centerOffset: [-center.x, -center.y, -center.z] as [number, number, number],
    };
  }, [scene]);

  return (
    <group scale={targetScale}>
      <primitive object={clonedScene} position={centerOffset} rotation={[0, Math.PI / 4, 0]} />
    </group>
  );
}

// Preload GLB model
useGLTF.preload('/assets/shopping_cart.glb');

function Fallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#7cffd4" wireframe />
    </mesh>
  );
}

export const TrolleyViewer: React.FC = () => {
  return (
    <div className="w-full max-w-xl h-[360px] sm:h-[420px] relative mx-auto flex items-center justify-center touch-pan-y">
      {/* Signature Ambient Trolly Glow Spotlight */}
      <div className="trolly-glow w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"></div>

      <Canvas
        camera={{ position: [0, 1.0, 4.2], fov: 55 }}
        style={{ background: 'transparent', touchAction: 'pan-y' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Crisp High-Contrast Lighting */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2.2} color="#e0f2fe" />
        <directionalLight position={[-5, 3, -5]} intensity={3.5} color="#7cffd4" />
        <pointLight position={[0, -1, 3]} intensity={2.0} color="#7cffd4" />

        <Suspense fallback={<Fallback />}>
          <Model />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};
