import React from 'react';
import { motion } from 'framer-motion';
import { MoleculePreset } from '../data/atomData';

interface MoleculeInfoPanelProps {
  preset: MoleculePreset | null;
  isAnimating: boolean;
}

const bondTypeConfig = {
  ionic: {
    label: 'IONIC BOND',
    icon: '⚡',
    description: 'Complete electron transfer from metal to non-metal',
    color: '#FDBA74',
    glow: '#FB923C',
    bg: 'from-orange-500/10 to-red-500/10 border-orange-500/30',
  },
  covalent: {
    label: 'COVALENT BOND',
    icon: '🔗',
    description: 'Electrons shared equally between atoms',
    color: '#34D399',
    glow: '#10B981',
    bg: 'from-green-500/10 to-cyan-500/10 border-green-500/30',
  },
  polar_covalent: {
    label: 'POLAR COVALENT',
    icon: '⚗️',
    description: 'Electrons shared unequally due to electronegativity difference',
    color: '#A78BFA',
    glow: '#8B5CF6',
    bg: 'from-purple-500/10 to-blue-500/10 border-purple-500/30',
  },
};

const MoleculeInfoPanel: React.FC<MoleculeInfoPanelProps> = ({ preset, isAnimating }) => {
  if (!preset) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="text-4xl mb-4"
        >
          ⚛️
        </motion.div>
        <p className="text-slate-400 text-sm">Select atoms or a molecule preset to see bond information</p>
      </div>
    );
  }

  const bondConfig = bondTypeConfig[preset.bondType];

  return (
    <div className="h-full overflow-y-auto space-y-3 p-1">
      {/* Molecule name and formula */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-3"
      >
        <motion.div
          animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
          className="text-4xl font-black font-orbitron"
          style={{ color: bondConfig.color, textShadow: `0 0 20px ${bondConfig.glow}` }}
        >
          {preset.formula}
        </motion.div>
        <div className="text-slate-300 font-semibold mt-1 font-rajdhani text-lg">{preset.name}</div>
      </motion.div>

      {/* Bond type badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-r ${bondConfig.bg} border rounded-xl p-3 text-center`}
      >
        <div className="text-xl mb-1">{bondConfig.icon}</div>
        <div className="font-bold text-sm font-orbitron" style={{ color: bondConfig.color }}>
          {bondConfig.label}
        </div>
        <div className="text-xs text-slate-400 mt-1 font-rajdhani">{bondConfig.description}</div>
      </motion.div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Geometry', value: preset.geometry, icon: '📐' },
          { label: 'Bond Angle', value: preset.bondAngle ? `${preset.bondAngle}°` : 'N/A', icon: '📏' },
          { label: 'Atoms', value: preset.atoms.join(', '), icon: '⚛️' },
          { label: 'Formula', value: preset.formula, icon: '🧪' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-2.5"
          >
            <div className="text-lg mb-0.5">{item.icon}</div>
            <div className="text-[10px] text-slate-500 font-rajdhani uppercase tracking-wider">{item.label}</div>
            <div className="text-sm font-semibold text-slate-200 font-orbitron">{item.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Lewis Structure */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/40 border border-cyan-500/20 rounded-xl p-3"
      >
        <div className="text-xs text-cyan-400 font-orbitron uppercase tracking-wider mb-2">
          Lewis Structure
        </div>
        <div className="text-center font-mono text-lg text-slate-200 bg-slate-900/50 rounded-lg py-2 px-3">
          {preset.lewisStructure}
        </div>
      </motion.div>

      {/* Fun fact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-3"
      >
        <div className="text-xs text-yellow-400 font-orbitron uppercase tracking-wider mb-1.5">
          💡 Fun Fact
        </div>
        <div className="text-xs text-slate-300 font-rajdhani leading-relaxed">{preset.funFact}</div>
      </motion.div>

      {/* Bond description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3"
      >
        <div className="text-xs text-slate-400 font-orbitron uppercase tracking-wider mb-1.5">Description</div>
        <div className="text-xs text-slate-300 font-rajdhani leading-relaxed">{preset.description}</div>
      </motion.div>
    </div>
  );
};

export default MoleculeInfoPanel;
