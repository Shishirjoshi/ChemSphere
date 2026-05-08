import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { MOLECULES, type MoleculeData } from './molecular-shape/molecules';

interface MoleculeVisualizerProps {
  moleculeKey?: string;
}

const Atom: React.FC<{
  position: [number, number, number];
  color: string;
  radius: number;
  element: string;
  showLabels: boolean;
}> = ({ position, color, radius, element, showLabels }) => {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      {showLabels && (
        <Html position={[0, radius + 0.3, 0]} center>
          <div className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded pointer-events-none">
            {element}
          </div>
        </Html>
      )}
    </group>
  );
};

const Bond: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
}> = ({ from, to, color = '#cccccc' }) => {
  const midpoint: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ];
  
  const distance = Math.sqrt(
    Math.pow(to[0] - from[0], 2) +
    Math.pow(to[1] - from[1], 2) +
    Math.pow(to[2] - from[2], 2)
  );

  return (
    <mesh position={midpoint} lookAt={new THREE.Vector3(to[0], to[1], to[2])}>
      <cylinderGeometry args={[0.12, 0.12, distance, 16]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
    </mesh>
  );
};

const MoleculeScene: React.FC<{ molecule: MoleculeData; showLabels: boolean }> = ({
  molecule,
  showLabels,
}) => {
  const hasAtoms = molecule.atoms && molecule.atoms.length > 0;

  if (!hasAtoms) {
    return <></>;
  }

  return (
    <>
      {molecule.bonds &&
        molecule.bonds.map((bond, i) => (
          <Bond
            key={i}
            from={molecule.atoms[bond.from].position}
            to={molecule.atoms[bond.to].position}
            color="#666666"
          />
        ))}
      {molecule.atoms.map((atom, i) => (
        <Atom
          key={i}
          position={atom.position}
          color={atom.color}
          radius={atom.radius}
          element={atom.element}
          showLabels={showLabels}
        />
      ))}
      {molecule.lonePairPositions &&
        molecule.lonePairPositions.map((pos, i) => (
          <mesh key={`lone-${i}`} position={pos}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial
              color="#d946ef"
              emissive="#d946ef"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
    </>
  );
};

export const MoleculeShapeVisualizer: React.FC<MoleculeVisualizerProps> = ({ moleculeKey = 'H2O' }) => {
  const [selectedMolecule, setSelectedMolecule] = useState<string>(moleculeKey);
  const [showLabels, setShowLabels] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  const molecule = MOLECULES[selectedMolecule];

  if (!molecule) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Molecule not found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#050b18] overflow-hidden">
      {/* 3D Canvas */}
      <div className="w-full h-[70vh]">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
          <ContactShadows position={[0, -2, 0]} scale={10} blur={2} opacity={0.3} />
          
          <Suspense fallback={null}>
            <MoleculeScene molecule={molecule} showLabels={showLabels} />
            <OrbitControls autoRotate autoRotateSpeed={2} />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Control Panel */}
      <div className="absolute top-6 right-6 z-50 flex flex-col gap-3">
        <motion.button
          onClick={() => setShowLabels(!showLabels)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 transition-colors"
        >
          {showLabels ? <Eye size={20} /> : <EyeOff size={20} />}
        </motion.button>
      </div>

      {/* Molecule Selector */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/80 to-transparent">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-semibold">
            Select Molecule
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(MOLECULES).map(([key, mol]) => (
              <motion.button
                key={key}
                onClick={() => setSelectedMolecule(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all duration-200 border ${
                  selectedMolecule === key
                    ? `bg-cyan-500/30 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/20`
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {mol.formula}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="absolute left-0 top-20 bottom-6 w-80 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur border border-white/10 rounded-r-2xl p-6 overflow-y-auto"
          >
            <motion.button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              ×
            </motion.button>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">{molecule.name}</h2>
                <p className="text-lg font-mono font-bold" style={{ color: molecule.color }}>
                  {molecule.formula}
                </p>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">{molecule.description}</p>

              <div className="space-y-2 pt-2">
                <InfoRow label="Geometry" value={molecule.geometry} icon="🔷" />
                <InfoRow label="Electron Geometry" value={molecule.electronGeometry} icon="⚛️" />
                <InfoRow label="Hybridization" value={molecule.hybridization} icon="🧬" />
                <InfoRow label="Bond Angle" value={molecule.bondAngle} icon="📐" />
                <InfoRow label="Polarity" value={molecule.polarity} icon={molecule.polarity === 'Polar' ? '⚡' : '⚖️'} />
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">VSEPR Pairs</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <p className="text-lg font-bold text-cyan-400">{molecule.vsepPairs.bonding}</p>
                    <p className="text-xs text-gray-400">Bonding</p>
                  </div>
                  <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                    <p className="text-lg font-bold text-pink-400">{molecule.vsepPairs.lonePairs}</p>
                    <p className="text-xs text-gray-400">Lone Pairs</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Info Button */}
      {!showInfo && (
        <motion.button
          onClick={() => setShowInfo(true)}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute left-6 top-20 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ChevronDown size={20} className="text-gray-400 rotate-90" />
        </motion.button>
      )}
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  icon: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-300">{value}</span>
  </div>
);

export default MoleculeShapeVisualizer;
