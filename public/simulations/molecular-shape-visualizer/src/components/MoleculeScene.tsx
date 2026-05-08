import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import type { MoleculeData } from "../data/molecules";

interface AtomProps {
  position: [number, number, number];
  color: string;
  radius: number;
  element: string;
  showLabels: boolean;
  pulseOffset?: number;
}

function Atom({ position, color, radius, element, showLabels, pulseOffset = 0 }: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime + pulseOffset;
    const scale = 1 + Math.sin(t * 1.8) * 0.04;
    if (meshRef.current) meshRef.current.scale.setScalar(scale);
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.08);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + Math.sin(t * 1.8) * 0.05;
    }
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + Math.sin(t * 1.8 + 1) * 0.04;
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 2.0, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
      {/* Mid glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.35, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      {/* Main sphere */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.15}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.35}
          envMapIntensity={0.8}
        />
      </mesh>
      {/* Specular highlight spot */}
      <mesh ref={innerRef} position={[radius * 0.3, radius * 0.3, radius * 0.5]}>
        <sphereGeometry args={[radius * 0.3, 16, 16]} />
        <meshBasicMaterial color="white" transparent opacity={0.08} />
      </mesh>
      {showLabels && (
        <Html center distanceFactor={9} style={{ pointerEvents: "none" }}>
          <div
            style={{
              color: "white",
              fontWeight: "900",
              fontSize: "13px",
              textShadow: `0 0 6px ${color}, 0 0 14px ${color}`,
              fontFamily: "'Courier New', monospace",
              userSelect: "none",
              letterSpacing: "0.05em",
            }}
          >
            {element}
          </div>
        </Html>
      )}
    </group>
  );
}

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  order: number;
}

function Bond({ start, end, order }: BondProps) {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = endVec.clone().sub(startVec);
  const length = direction.length();
  const midpoint = startVec.clone().add(endVec).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

  const offsets = order === 2 ? [-0.09, 0.09] : order === 3 ? [-0.12, 0, 0.12] : [0];
  const bondColor = "#88ccff";
  const bondRadius = order > 1 ? 0.045 : 0.055;

  return (
    <group position={[midpoint.x, midpoint.y, midpoint.z]} quaternion={quaternion}>
      {offsets.map((offset, i) => (
        <mesh key={i} position={[offset, 0, 0]}>
          <cylinderGeometry args={[bondRadius, bondRadius, length * 0.82, 20]} />
          <meshPhysicalMaterial
            color={bondColor}
            metalness={0.3}
            roughness={0.25}
            emissive={bondColor}
            emissiveIntensity={0.35}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
    </group>
  );
}

interface LonePairProps {
  position: [number, number, number];
  index: number;
  animate: boolean;
}

function LonePair({ position, index, animate }: LonePairProps) {
  const group = useRef<THREE.Group>(null);
  const offset = (index * Math.PI * 2) / 3;
  const e1Ref = useRef<THREE.Mesh>(null);
  const e2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime + offset;
    if (group.current && animate) {
      group.current.rotation.z = Math.sin(t * 1.2) * 0.25;
      group.current.rotation.x = Math.cos(t * 0.8) * 0.15;
    }
    // Electron pulse
    [e1Ref, e2Ref].forEach((ref, i) => {
      if (ref.current) {
        const pScale = 1 + Math.sin(t * 3 + i * Math.PI) * 0.2;
        ref.current.scale.setScalar(pScale);
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.7 + Math.sin(t * 3 + i * Math.PI) * 0.3;
      }
    });
  });

  return (
    <group ref={group} position={position}>
      {/* Cloud/orbital indicator */}
      <mesh>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color="#dd44ff" transparent opacity={0.07} />
      </mesh>
      {/* Electron 1 */}
      <mesh ref={e1Ref} position={[-0.15, 0, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#ff44ff" transparent opacity={0.9} />
      </mesh>
      {/* Glow 1 */}
      <mesh position={[-0.15, 0, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshBasicMaterial color="#ff44ff" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
      {/* Electron 2 */}
      <mesh ref={e2Ref} position={[0.15, 0, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#ff44ff" transparent opacity={0.9} />
      </mesh>
      {/* Glow 2 */}
      <mesh position={[0.15, 0, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshBasicMaterial color="#ff44ff" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function ElectronOrbit({ radius, color, speed }: { radius: number; color: string; speed: number }) {
  const electronRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (electronRef.current) {
      electronRef.current.position.x = Math.cos(t) * radius;
      electronRef.current.position.z = Math.sin(t) * radius;
      electronRef.current.position.y = Math.sin(t * 0.5) * radius * 0.2;
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.2, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <group>
      <Line points={points} color={color} lineWidth={0.5} transparent opacity={0.1} />
      <mesh ref={electronRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

interface MoleculeSceneProps {
  molecule: MoleculeData;
  showLonePairs: boolean;
  showLabels: boolean;
  showBondAngles: boolean;
  animateRepulsion: boolean;
}

export function MoleculeScene({
  molecule,
  showLonePairs,
  showLabels,
  showBondAngles,
  animateRepulsion,
}: MoleculeSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && animateRepulsion) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <>
      {/* Environment lighting */}
      <ambientLight intensity={0.35} color="#aabbff" />
      <pointLight position={[8, 8, 8]} intensity={2} color="#88ddff" />
      <pointLight position={[-8, -8, -8]} intensity={1} color="#ffaadd" />
      <pointLight position={[0, 8, -8]} intensity={0.8} color="#aaffdd" />
      <spotLight
        position={[6, 8, 6]}
        angle={0.4}
        penumbra={0.6}
        intensity={3}
        color="white"
        castShadow
      />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={14}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.8}
        zoomSpeed={0.8}
      />

      <group ref={groupRef}>
        {/* Atoms */}
        {molecule.atoms.map((atom, i) => (
          <Atom
            key={`${molecule.formula}-atom-${i}`}
            position={atom.position}
            color={atom.color}
            radius={atom.radius}
            element={atom.element}
            showLabels={showLabels}
            pulseOffset={(i * Math.PI * 2) / molecule.atoms.length}
          />
        ))}

        {/* Bonds */}
        {molecule.bonds.map((bond, i) => {
          const fromAtom = molecule.atoms[bond.from];
          const toAtom = molecule.atoms[bond.to];
          return (
            <Bond
              key={`bond-${i}`}
              start={fromAtom.position}
              end={toAtom.position}
              order={bond.order || 1}
            />
          );
        })}

        {/* Lone Pairs */}
        {showLonePairs &&
          molecule.lonePairPositions.map((pos, i) => (
            <LonePair key={`lp-${i}`} position={pos} index={i} animate={animateRepulsion} />
          ))}

        {/* Bond Angle label */}
        {showBondAngles && molecule.bonds.length >= 2 && (
          <Html
            position={[0, -1.8, 0]}
            center
            style={{ pointerEvents: "none" }}
          >
            <div
              style={{
                color: "#ffdd44",
                fontWeight: "bold",
                fontSize: "12px",
                textShadow: "0 0 10px #ffcc00, 0 0 20px #ffcc0060",
                fontFamily: "'Courier New', monospace",
                background: "rgba(0,0,0,0.55)",
                padding: "3px 10px",
                borderRadius: "6px",
                border: "1px solid rgba(255,204,0,0.4)",
                backdropFilter: "blur(8px)",
                whiteSpace: "nowrap",
              }}
            >
              ∠ Bond Angle: {molecule.bondAngle}
            </div>
          </Html>
        )}

        {/* Electron orbits decorative */}
        {animateRepulsion && molecule.atoms.length <= 4 && (
          <group>
            <ElectronOrbit radius={2.8} color="#06b6d4" speed={0.8} />
            <group rotation={[Math.PI / 2.5, 0, 0]}>
              <ElectronOrbit radius={3.2} color="#a855f7" speed={-0.6} />
            </group>
          </group>
        )}
      </group>

      {/* Particle Field */}
      <ParticleField />
    </>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0.02, 0.71, 0.83], // cyan
      [0.66, 0.33, 0.97], // purple
      [0.93, 0.27, 0.6],  // pink
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.015;
      points.current.rotation.x = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}
