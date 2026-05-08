import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { MoleculePreset, getAtomBySymbol } from '../data/atomData';

interface AtomSphereProps {
  position: [number, number, number];
  color: string;
  glowColor: string;
  symbol: string;
  radius?: number;
}

const AtomSphere: React.FC<AtomSphereProps> = ({ position, color, glowColor, symbol, radius = 0.4 }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.03;
      meshRef.current.scale.setScalar(1 + pulse);
    }
  });

  return (
    <group position={position}>
      {/* Glow sphere */}
      <Sphere args={[radius * 1.4, 16, 16]}>
        <meshBasicMaterial color={glowColor} transparent opacity={0.08} />
      </Sphere>
      {/* Main atom */}
      <Sphere ref={meshRef} args={[radius, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.3}
        />
      </Sphere>
      {/* Label */}
      <Billboard>
        <Text
          position={[0, 0, radius + 0.05]}
          fontSize={radius * 0.65}
          color="white"
          font={undefined}
          anchorX="center"
          anchorY="middle"
        >
          {symbol}
        </Text>
      </Billboard>
    </group>
  );
};

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  bondOrder?: number;
  color?: string;
}

const Bond: React.FC<BondProps> = ({ start, end, bondOrder = 1, color = '#94A3B8' }) => {
  const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
  const length = direction.length();
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  const quaternion = useMemo(() => {
    const dir = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]).normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return q;
  }, [start, end]);

  const offsets = bondOrder === 1 ? [0] : bondOrder === 2 ? [-0.07, 0.07] : [-0.12, 0, 0.12];

  return (
    <>
      {offsets.map((_offset, i) => (
        <group key={i} position={mid} quaternion={quaternion}>
          <Cylinder args={[0.05, 0.05, length, 8]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.4}
            />
          </Cylinder>
        </group>
      ))}
    </>
  );
};

const ElectronOrbit: React.FC<{ radius: number; speed: number; color: string; tilt?: number }> = ({
  radius,
  speed,
  color,
  tilt = 0,
}) => {
  const electronRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(Math.random() * Math.PI * 2);

  useFrame(() => {
    timeRef.current += speed;
    if (electronRef.current) {
      electronRef.current.position.x = Math.cos(timeRef.current) * radius;
      electronRef.current.position.y = Math.sin(timeRef.current) * radius * Math.cos(tilt);
      electronRef.current.position.z = Math.sin(timeRef.current) * radius * Math.sin(tilt);
    }
  });

  return (
    <group>
      <mesh ref={electronRef}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

interface MoleculeConfig {
  atoms: Array<{ symbol: string; pos: [number, number, number] }>;
  bonds: Array<{ start: [number, number, number]; end: [number, number, number]; order: number }>;
}

const getMoleculeConfig = (preset: MoleculePreset): MoleculeConfig => {
  switch (preset.id) {
    case 'h2o':
      return {
        atoms: [
          { symbol: 'O', pos: [0, 0, 0] },
          { symbol: 'H', pos: [-1.0, -0.8, 0] },
          { symbol: 'H', pos: [1.0, -0.8, 0] },
        ],
        bonds: [
          { start: [0, 0, 0], end: [-1.0, -0.8, 0], order: 1 },
          { start: [0, 0, 0], end: [1.0, -0.8, 0], order: 1 },
        ],
      };
    case 'co2':
      return {
        atoms: [
          { symbol: 'C', pos: [0, 0, 0] },
          { symbol: 'O', pos: [-1.4, 0, 0] },
          { symbol: 'O', pos: [1.4, 0, 0] },
        ],
        bonds: [
          { start: [0, 0, 0], end: [-1.4, 0, 0], order: 2 },
          { start: [0, 0, 0], end: [1.4, 0, 0], order: 2 },
        ],
      };
    case 'nh3':
      return {
        atoms: [
          { symbol: 'N', pos: [0, 0.4, 0] },
          { symbol: 'H', pos: [-1.0, -0.5, 0.5] },
          { symbol: 'H', pos: [1.0, -0.5, 0.5] },
          { symbol: 'H', pos: [0, -0.5, -1.1] },
        ],
        bonds: [
          { start: [0, 0.4, 0], end: [-1.0, -0.5, 0.5], order: 1 },
          { start: [0, 0.4, 0], end: [1.0, -0.5, 0.5], order: 1 },
          { start: [0, 0.4, 0], end: [0, -0.5, -1.1], order: 1 },
        ],
      };
    case 'ch4':
      return {
        atoms: [
          { symbol: 'C', pos: [0, 0, 0] },
          { symbol: 'H', pos: [1.0, 1.0, 0] },
          { symbol: 'H', pos: [-1.0, -1.0, 0] },
          { symbol: 'H', pos: [-1.0, 1.0, 1.0] },
          { symbol: 'H', pos: [1.0, -1.0, 1.0] },
        ],
        bonds: [
          { start: [0, 0, 0], end: [1.0, 1.0, 0], order: 1 },
          { start: [0, 0, 0], end: [-1.0, -1.0, 0], order: 1 },
          { start: [0, 0, 0], end: [-1.0, 1.0, 1.0], order: 1 },
          { start: [0, 0, 0], end: [1.0, -1.0, 1.0], order: 1 },
        ],
      };
    case 'nacl':
      return {
        atoms: [
          { symbol: 'Na', pos: [-1.2, 0, 0] },
          { symbol: 'Cl', pos: [1.2, 0, 0] },
        ],
        bonds: [
          { start: [-1.2, 0, 0], end: [1.2, 0, 0], order: 1 },
        ],
      };
    default:
      return { atoms: [], bonds: [] };
  }
};

const SceneContent: React.FC<{ preset: MoleculePreset }> = ({ preset }) => {
  const config = useMemo(() => getMoleculeConfig(preset), [preset]);
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  return (
    <group ref={groupRef}>
      {config.bonds.map((bond, i) => {
        return (
          <Bond
            key={i}
            start={bond.start}
            end={bond.end}
            bondOrder={bond.order}
            color={preset.bondType === 'ionic' ? '#FDBA74' : '#60A5FA'}
          />
        );
      })}
      {config.atoms.map((a, i) => {
        const atomData = getAtomBySymbol(a.symbol);
        return (
          <AtomSphere
            key={i}
            position={a.pos}
            color={atomData?.color || '#60A5FA'}
            glowColor={atomData?.glowColor || '#3B82F6'}
            symbol={a.symbol}
            radius={a.symbol === 'H' ? 0.28 : a.symbol === 'Na' ? 0.55 : 0.38}
          />
        );
      })}
      {/* Orbital electrons */}
      {preset.bondType !== 'ionic' && config.atoms.slice(0, 1).map((_a, i) => (
        <ElectronOrbit key={i} radius={0.7} speed={0.03} color="#60A5FA" tilt={0.5} />
      ))}
    </group>
  );
};

interface Molecule3DProps {
  preset: MoleculePreset;
}

const Molecule3D: React.FC<Molecule3DProps> = ({ preset }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#60A5FA" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#A78BFA" />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#34D399" />
      <React.Suspense fallback={null}>
        <SceneContent preset={preset} />
      </React.Suspense>
      <OrbitControls enablePan={false} enableZoom={true} autoRotate={false} />
    </Canvas>
  );
};

export default Molecule3D;
