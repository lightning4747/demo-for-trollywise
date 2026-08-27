import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  const { scene } = useGLTF('/assets/shopping_cart.glb');

  // Single merged PBR material per specification
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c9cdd1'),
      metalness: 0.4,
      roughness: 0.45,
    });
  }, []);

  // Process scene hierarchy, apply single material via scene.traverse, and normalize bounding box
  const { clonedScene, targetScale, centerOffset } = useMemo(() => {
    const clone = scene.clone(true);
    
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = material;
      }
    });

    // Compute exact bounding box for zero-clipping normalization
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
  }, [scene, material]);

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
      <meshStandardMaterial color="#4ade80" wireframe />
    </mesh>
  );
}

export const TrolleyViewer: React.FC = () => {
  return (
    <div className="w-full max-w-xl h-[360px] sm:h-[420px] relative mx-auto flex items-center justify-center touch-pan-y">
      <Canvas
        camera={{ position: [0, 0.6, 4.0], fov: 45 }}
        style={{ background: 'transparent', touchAction: 'pan-y' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Ambient Light */}
        <ambientLight intensity={1.2} />
        
        {/* Soft Cool-White Key Light from front-upper side */}
        <directionalLight position={[5, 8, 5]} intensity={2.0} color="#e0f2fe" />
        
        {/* Dim Mint-Green (#4ade80) Rim Light from behind */}
        <directionalLight position={[-5, 4, -6]} intensity={3.5} color="#4ade80" />
        <pointLight position={[0, -1, -3]} intensity={2.0} color="#4ade80" />

        <Suspense fallback={<Fallback />}>
          <Model />
        </Suspense>

        {/* OrbitControls with slow auto-rotate on idle and drag-to-rotate (no zoom, no pan) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={1.0}
          rotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};
