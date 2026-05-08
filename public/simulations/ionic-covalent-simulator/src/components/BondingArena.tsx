import React, { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtomData } from '../data/atomData';
import ElectronShell from './ElectronShell';

interface PlacedAtom {
  id: string;
  atom: AtomData;
  x: number;
  y: number;
}

interface BondingArenaProps {
  placedAtoms: PlacedAtom[];
  onAtomDrop: (atom: AtomData, x: number, y: number) => void;
  onAtomMove: (id: string, x: number, y: number) => void;
  onAtomRemove: (id: string) => void;
  bondType: 'ionic' | 'covalent' | 'polar_covalent' | null;
  isAnimating: boolean;
  dragAtom: AtomData | null;
}

const BondingArena: React.FC<BondingArenaProps> = ({
  placedAtoms,
  onAtomDrop,
  onAtomMove,
  onAtomRemove,
  bondType,
  isAnimating,
}) => {
  const arenaRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{ id: string; startX: number; startY: number } | null>(null);

  const getBondColor = () => {
    if (!bondType) return '#60A5FA';
    if (bondType === 'ionic') return '#FDBA74';
    if (bondType === 'polar_covalent') return '#A78BFA';
    return '#34D399';
  };

  const getBondLabel = () => {
    if (!bondType) return '';
    if (bondType === 'ionic') return 'Ionic Bond';
    if (bondType === 'polar_covalent') return 'Polar Covalent';
    return 'Covalent Bond';
  };

  const handleArenaDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const rect = arenaRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const data = e.dataTransfer.getData('atom');
      if (data) {
        try {
          const atom: AtomData = JSON.parse(data);
          onAtomDrop(atom, x, y);
        } catch {}
      }
    },
    [onAtomDrop]
  );

  const startDragAtom = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    draggingRef.current = { id, startX: e.clientX, startY: e.clientY };
    const onMove = (ev: MouseEvent) => {
      if (!draggingRef.current || !arenaRef.current) return;
      const rect = arenaRef.current.getBoundingClientRect();
      const x = Math.max(5, Math.min(95, ((ev.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(5, Math.min(95, ((ev.clientY - rect.top) / rect.height) * 100));
      onAtomMove(id, x, y);
    };
    const onUp = () => {
      draggingRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const getBondLines = () => {
    if (placedAtoms.length < 2 || !bondType) return [];
    const lines = [];
    for (let i = 1; i < placedAtoms.length; i++) {
      lines.push({ from: placedAtoms[0], to: placedAtoms[i] });
    }
    return lines;
  };

  const bondLines = getBondLines();
  const bondColor = getBondColor();

  return (
    <div
      ref={arenaRef}
      className="relative w-full h-full rounded-2xl overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleArenaDrop}
    >
      {/* Arena Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(96,165,250,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Corner decorations */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-16 h-16 border-2 border-blue-500/20 m-3 rounded`} />
        ))}
      </div>

      {/* Empty state */}
      {placedAtoms.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-center"
          >
            <div className="text-5xl mb-3">⚗️</div>
            <p className="text-slate-400 text-sm font-rajdhani">Drag atoms here or select a molecule preset</p>
            <p className="text-slate-500 text-xs mt-1">Drop 2+ atoms to simulate bonding</p>
          </motion.div>
        </div>
      )}

      {/* SVG bond lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {bondLines.map((line, i) => {
          const x1 = `${line.from.x}%`;
          const y1 = `${line.from.y}%`;
          const x2 = `${line.to.x}%`;
          const y2 = `${line.to.y}%`;
          const mx = `${(line.from.x + line.to.x) / 2}%`;
          const my = `${(line.from.y + line.to.y) / 2}%`;

          return (
            <g key={i} filter="url(#glow)">
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={bondColor} strokeWidth="2" strokeOpacity="0.3" />
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={bondColor}
                strokeWidth="2"
                strokeDasharray="6 4"
                strokeOpacity="0.8"
              >
                {isAnimating && (
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.5s" repeatCount="indefinite" />
                )}
              </line>
              {/* Electron moving along bond */}
              {isAnimating && (
                <circle r="4" fill={bondColor} opacity="0.9">
                  <animateMotion dur="1.2s" repeatCount="indefinite">
                    <mpath xlinkHref={`#bond-path-${i}`} />
                  </animateMotion>
                </circle>
              )}
              <path id={`bond-path-${i}`} d={`M ${x1} ${y1} L ${x2} ${y2}`} fill="none" />
              {/* Bond label */}
              {bondType && (
                <text x={mx} y={my} textAnchor="middle" dy="-8" fontSize="10" fill={bondColor} opacity="0.9" fontFamily="Orbitron">
                  {getBondLabel()}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Ionic electron transfer animation */}
      {bondType === 'ionic' && isAnimating && placedAtoms.length >= 2 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
          {bondLines.map((line, i) => (
            <circle key={i} r="6" fill="#FDBA74" opacity="0.9">
              <animateMotion
                dur="0.8s"
                repeatCount="3"
                path={`M ${line.from.x * (arenaRef.current?.offsetWidth || 600) / 100} ${line.from.y * (arenaRef.current?.offsetHeight || 400) / 100} L ${line.to.x * (arenaRef.current?.offsetWidth || 600) / 100} ${line.to.y * (arenaRef.current?.offsetHeight || 400) / 100}`}
              />
            </circle>
          ))}
        </svg>
      )}

      {/* Placed atoms */}
      <AnimatePresence>
        {placedAtoms.map((pa) => (
          <motion.div
            key={pa.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'absolute',
              left: `${pa.x}%`,
              top: `${pa.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
            className="cursor-grab active:cursor-grabbing select-none"
            onMouseDown={(e) => startDragAtom(e, pa.id)}
          >
            <div className="relative group">
              {/* Atom glow ring */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${pa.atom.glowColor}40, transparent)`,
                  transform: 'scale(1.5)',
                }}
              />
              <ElectronShell atom={pa.atom} size={80} animated={true} />
              {/* Remove button */}
              <button
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/80 border border-red-400 text-white text-xs hidden group-hover:flex items-center justify-center hover:bg-red-400 z-20"
                onClick={(e) => { e.stopPropagation(); onAtomRemove(pa.id); }}
              >
                ×
              </button>
              {/* Atom label */}
              <div
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap font-orbitron"
                style={{ color: pa.atom.color, textShadow: `0 0 6px ${pa.atom.glowColor}` }}
              >
                {pa.atom.symbol}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BondingArena;
