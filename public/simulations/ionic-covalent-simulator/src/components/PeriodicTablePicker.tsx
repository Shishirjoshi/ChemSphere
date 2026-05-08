import React from 'react';
import { motion } from 'framer-motion';
import { ATOMS, AtomData } from '../data/atomData';

interface PeriodicTablePickerProps {
  onSelectAtom: (atom: AtomData) => void;
  selectedAtoms: AtomData[];
}

const categoryColors: Record<string, string> = {
  metal: 'from-orange-500/20 to-red-500/20 border-orange-500/40 hover:border-orange-400',
  nonmetal: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 hover:border-blue-400',
  noble: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/40 hover:border-yellow-400',
};

const PeriodicTablePicker: React.FC<PeriodicTablePickerProps> = ({ onSelectAtom, selectedAtoms }) => {
  const selectedSymbols = selectedAtoms.map((a) => a.symbol);

  const groups = [
    ATOMS.slice(0, 2),
    ATOMS.slice(2, 10),
    ATOMS.slice(10, 18),
    ATOMS.slice(18),
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-orange-500/60 border border-orange-400"></div>
          <span className="text-xs text-slate-400">Metal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500/60 border border-blue-400"></div>
          <span className="text-xs text-slate-400">Nonmetal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-500/60 border border-yellow-400"></div>
          <span className="text-xs text-slate-400">Noble Gas</span>
        </div>
      </div>

      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-wrap gap-1.5">
          {group.map((atom) => {
            const isSelected = selectedSymbols.includes(atom.symbol);
            const catClass = categoryColors[atom.category];
            return (
              <motion.button
                key={atom.symbol}
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectAtom(atom)}
                className={`
                  relative w-12 h-14 rounded-lg border bg-gradient-to-br ${catClass}
                  flex flex-col items-center justify-center cursor-pointer
                  transition-all duration-200 backdrop-blur-sm group
                  ${isSelected ? 'ring-2 ring-white/60 brightness-125' : ''}
                `}
                title={`${atom.name} | Valence e⁻: ${atom.valenceElectrons}`}
              >
                <span className="text-[10px] text-slate-400 leading-none">{atom.atomicNumber}</span>
                <span
                  className="text-sm font-bold leading-tight"
                  style={{ color: atom.color, textShadow: `0 0 8px ${atom.glowColor}` }}
                >
                  {atom.symbol}
                </span>
                <span className="text-[8px] text-slate-500 leading-none truncate w-full text-center px-0.5">
                  {atom.name.slice(0, 4)}
                </span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border border-white/50 text-[7px] flex items-center justify-center font-bold text-slate-900">
                    ✓
                  </div>
                )}
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  <div className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-[10px] text-slate-200 whitespace-nowrap">
                    <div className="font-bold" style={{ color: atom.color }}>{atom.name}</div>
                    <div>Valence e⁻: {atom.valenceElectrons}</div>
                    <div>EN: {atom.electronegativity}</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default PeriodicTablePicker;
