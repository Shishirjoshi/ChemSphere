import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const MoleculeGroup = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Atom */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1, 32, 32]}>
          <MeshDistortMaterial
            color="#06b6d4"
            speed={2}
            distort={0.3}
            roughness={0}
            metalness={0.8}
            emissive="#06b6d4"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>

      {/* Orbiting Atoms */}
      {[
        [2, 1, 0],
        [-1.5, -2, 1],
        [0, 2, -1.5],
        [-2.5, 0.5, -1],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <Float speed={3 + i} rotationIntensity={1} floatIntensity={1}>
            <Sphere args={[0.4, 16, 16]}>
              <MeshWobbleMaterial
                color={i % 2 === 0 ? "#3b82f6" : "#a855f7"}
                speed={1}
                factor={0.4}
              />
            </Sphere>
          </Float>
          {/* Bonds */}
          <mesh rotation-z={Math.atan2(pos[1], pos[0])} position={[-pos[0]/2, -pos[1]/2, -pos[2]/2]}>
             <cylinderGeometry args={[0.05, 0.05, Math.sqrt(pos[0]**2 + pos[1]**2 + pos[2]**2), 8]} />
             <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const HeroVisual: React.FC = () => {
  return (
    <div className="w-full h-[500px] lg:h-[600px] relative">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <MoleculeGroup />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
