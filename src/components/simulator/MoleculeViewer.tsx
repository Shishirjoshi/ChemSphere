import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float, useHelper, Float as DreiFloat } from '@react-three/drei';
import * as THREE from 'three';

interface AtomProps {
  type: 'H' | 'C' | 'O' | 'N' | 'Na' | 'Cl';
  position: [number, number, number];
}

const Atom = ({ type, position }: AtomProps) => {
  const getColor = () => {
    switch (type) {
      case 'H': return '#ffffff';
      case 'C': return '#333333';
      case 'O': return '#ef4444';
      case 'N': return '#3b82f6';
      case 'Na': return '#a855f7';
      case 'Cl': return '#22c55e';
      default: return '#cccccc';
    }
  };

  const getRadius = () => {
    switch (type) {
      case 'H': return 0.4;
      case 'C': return 0.7;
      case 'O': return 0.65;
      case 'N': return 0.65;
      case 'Na': return 0.9;
      case 'Cl': return 0.8;
      default: return 0.5;
    }
  };

  return (
    <DreiFloat speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position}>
        <sphereGeometry args={[getRadius(), 32, 32]} />
        <meshStandardMaterial 
          color={getColor()} 
          roughness={0.1} 
          metalness={0.2} 
          emissive={getColor()}
          emissiveIntensity={0.2}
        />
      </mesh>
    </DreiFloat>
  );
};

const Bond = ({ from, to }: { from: [number, number, number], to: [number, number, number] }) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const orientation = new THREE.Matrix4();
  const up = new THREE.Vector3(0, 1, 0);
  orientation.lookAt(start, end, up);
  orientation.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));

  return (
    <mesh 
      position={new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)} 
      rotation={new THREE.Euler().setFromRotationMatrix(orientation)}
    >
      <cylinderGeometry args={[0.1, 0.1, length, 8]} />
      <meshStandardMaterial color="#888888" transparent opacity={0.6} metalness={0.8} />
    </mesh>
  );
};

interface MoleculeData {
  atoms: AtomProps[];
  bonds: { from: number, to: number }[];
}

export const MoleculeViewer: React.FC<{ data: MoleculeData }> = ({ data }) => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls enablePan={false} maxDistance={15} minDistance={3} />
        
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <Suspense fallback={null}>
          <group>
            {data.atoms.map((atom, i) => (
              <Atom key={i} {...atom} />
            ))}
            {data.bonds.map((bond, i) => (
              <Bond 
                key={i} 
                from={data.atoms[bond.from].position} 
                to={data.atoms[bond.to].position} 
              />
            ))}
          </group>
          <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};
