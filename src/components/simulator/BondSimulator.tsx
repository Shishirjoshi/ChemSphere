import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Info, RefreshCw, Zap, CheckCircle2, ChevronRight, Share2 } from 'lucide-react';
import { MoleculeViewer } from './MoleculeViewer';
import { cn } from '../../lib/utils';

// Simplified molecules data for NEB
const MOLECULES = [
  {
    id: 'H2O',
    name: 'Water',
    formula: 'H₂O',
    type: 'Covalent',
    description: 'A bent molecule with a bond angle of 104.5°. Polar covalent bonding.',
    geometry: 'Bent / V-shaped',
    bondAngle: '104.5°',
    lewis: 'H:O:H (with 2 lone pairs on Oxygen)',
    data: {
      atoms: [
        { type: 'O', position: [0, 0, 0] },
        { type: 'H', position: [1.2, 0.8, 0] },
        { type: 'H', position: [-1.2, 0.8, 0] },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }]
    }
  },
  {
    id: 'CO2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    type: 'Covalent',
    description: 'Linear molecule with double bonds. Non-polar due to symmetry.',
    geometry: 'Linear',
    bondAngle: '180°',
    lewis: 'O=C=O',
    data: {
      atoms: [
        { type: 'C', position: [0, 0, 0] },
        { type: 'O', position: [1.5, 0, 0] },
        { type: 'O', position: [-1.5, 0, 0] },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }]
    }
  },
  {
    id: 'NH3',
    name: 'Ammonia',
    formula: 'NH₃',
    type: 'Covalent',
    description: 'Trigonal pyramidal geometry due to lone pair on Nitrogen.',
    geometry: 'Trigonal Pyramidal',
    bondAngle: '107.3°',
    lewis: 'H-N(lone pair)-H (Pyramidal)',
    data: {
      atoms: [
        { type: 'N', position: [0, 0.5, 0] },
        { type: 'H', position: [1.2, -0.5, 0] },
        { type: 'H', position: [-0.6, -0.5, 1.0] },
        { type: 'H', position: [-0.6, -0.5, -1.0] },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }]
    }
  },
  {
    id: 'CH4',
    name: 'Methane',
    formula: 'CH₄',
    type: 'Covalent',
    description: 'Perfect tetrahedral geometry with 109.5° bond angles.',
    geometry: 'Tetrahedral',
    bondAngle: '109.5°',
    lewis: 'Central C with 4 H atoms',
    data: {
      atoms: [
        { type: 'C', position: [0, 0, 0] },
        { type: 'H', position: [1.2, 1.2, 1.2] },
        { type: 'H', position: [-1.2, -1.2, 1.2] },
        { type: 'H', position: [-1.2, 1.2, -1.2] },
        { type: 'H', position: [1.2, -1.2, -1.2] },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 }]
    }
  },
  {
    id: 'NaCl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    type: 'Ionic',
    description: 'Ionic lattice structure where Na transfers electron to Cl.',
    geometry: 'Cubic Lattice (portion)',
    bondAngle: 'N/A (Lattice)',
    lewis: '[Na]+ [:Cl:]-',
    data: {
      atoms: [
        { type: 'Na', position: [-1, 0, 0] },
        { type: 'Cl', position: [1, 0, 0] },
      ],
      bonds: [{ from: 0, to: 1 }]
    }
  }
];

const ELEMENTS = [
  { symbol: 'H', name: 'Hydrogen', color: 'bg-white text-black' },
  { symbol: 'C', name: 'Carbon', color: 'bg-zinc-800 text-white' },
  { symbol: 'N', name: 'Nitrogen', color: 'bg-blue-600 text-white' },
  { symbol: 'O', name: 'Oxygen', color: 'bg-red-500 text-white' },
  { symbol: 'Na', name: 'Sodium', color: 'bg-purple-500 text-white' },
  { symbol: 'Cl', name: 'Chlorine', color: 'bg-green-500 text-white' },
];

export const BondSimulator: React.FC = () => {
  const [selectedMolecule, setSelectedMolecule] = useState(MOLECULES[0]);
  const [activeTab, setActiveTab] = useState<'visual' | 'theory'>('visual');

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 lg:p-8 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                 <Zap size={18} />
              </div>
              <h2 className="text-2xl font-black">Bond Simulation Lab</h2>
           </div>
           <p className="text-white/50 text-sm">Select a molecule to explore its 3D structure and bonding properties.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-colors">
              <RefreshCw size={16} /> Reset
           </button>
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all">
              <Share2 size={16} /> Share Result
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
        {/* Left: Controls & Info */}
        <div className="xl:col-span-3 flex flex-col gap-6 order-2 xl:order-1">
           {/* Periodic Table Quick Select */}
           <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Elements Used</p>
              <div className="grid grid-cols-3 gap-3">
                 {ELEMENTS.map(el => (
                    <div key={el.symbol} className="flex flex-col items-center gap-1 group cursor-help">
                       <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-inner", el.color)}>
                          {el.symbol}
                       </div>
                       <span className="text-[8px] text-white/50 font-bold uppercase">{el.name}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Molecule Selector */}
           <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex-1">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Molecules Library</p>
              <div className="space-y-3">
                 {MOLECULES.map(mol => (
                    <button
                       key={mol.id}
                       onClick={() => setSelectedMolecule(mol)}
                       className={cn(
                          "w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group",
                          selectedMolecule.id === mol.id 
                             ? "bg-cyan-500/10 border-cyan-500/50" 
                             : "bg-white/2 border-white/5 hover:bg-white/8 hover:border-white/20"
                       )}
                    >
                       <div>
                          <p className="text-xs font-bold text-white/40 mb-1">{mol.type} Bond</p>
                          <h3 className="font-black text-lg">{mol.name}</h3>
                          <p className="text-cyan-400 font-mono text-sm">{mol.formula}</p>
                       </div>
                       <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                          selectedMolecule.id === mol.id ? "bg-cyan-500 text-white" : "bg-white/5 text-white/20 group-hover:bg-white/10"
                       )}>
                          <ChevronRight size={18} />
                       </div>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Center: 3D View */}
        <div className="xl:col-span-6 order-1 xl:order-2 flex flex-col gap-4">
           <div className="relative flex-1 min-h-[400px] rounded-[2.5rem] bg-black/40 border border-white/10 overflow-hidden shadow-2xl">
              <div className="absolute top-6 left-6 z-10">
                 <div className="px-4 py-2 rounded-xl bg-[#050B18]/80 backdrop-blur-md border border-white/10">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-0.5">Structure</span>
                    <h4 className="font-black text-xl">{selectedMolecule.name}</h4>
                 </div>
              </div>

              <div className="absolute top-6 right-6 z-10 flex gap-2">
                 <button className="w-10 h-10 rounded-xl bg-[#050B18]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                    <Info size={18} />
                 </button>
              </div>

              <MoleculeViewer data={selectedMolecule.data as any} />
              
              <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-center">
                 <div className="px-6 py-3 rounded-2xl bg-[#050B18]/80 backdrop-blur-md border border-white/10 flex items-center gap-8">
                    <div className="text-center">
                       <span className="text-[9px] font-bold text-white/30 uppercase block mb-1">Geometry</span>
                       <span className="text-sm font-bold text-white">{selectedMolecule.geometry}</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="text-center">
                       <span className="text-[9px] font-bold text-white/30 uppercase block mb-1">Bond Angle</span>
                       <span className="text-sm font-bold text-white">{selectedMolecule.bondAngle}</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="text-center">
                       <span className="text-[9px] font-bold text-white/30 uppercase block mb-1">Stability</span>
                       <span className="text-sm font-bold text-emerald-400">High</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Details & Theory */}
        <div className="xl:col-span-3 flex flex-col gap-6 order-3">
           <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
              <button
                 onClick={() => setActiveTab('visual')}
                 className={cn(
                    "flex-1 py-3 rounded-xl font-bold text-xs transition-all",
                    activeTab === 'visual' ? "bg-cyan-500 text-white shadow-lg" : "text-white/40 hover:text-white"
                 )}
              >
                 Properties
              </button>
              <button
                 onClick={() => setActiveTab('theory')}
                 className={cn(
                    "flex-1 py-3 rounded-xl font-bold text-xs transition-all",
                    activeTab === 'theory' ? "bg-cyan-500 text-white shadow-lg" : "text-white/40 hover:text-white"
                 )}
              >
                 Lewis Structure
              </button>
           </div>

           <div className="flex-1 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                 {activeTab === 'visual' ? (
                    <motion.div
                       key="visual"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="h-full flex flex-col"
                    >
                       <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Beaker size={18} className="text-cyan-400" /> Molecular Info
                       </h4>
                       <p className="text-white/60 text-sm leading-relaxed mb-8">
                          {selectedMolecule.description}
                       </p>
                       
                       <div className="space-y-4 mb-auto">
                          <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                             <span className="text-[10px] font-bold text-white/30 uppercase block mb-1">Key Observation</span>
                             <p className="text-sm text-cyan-200">Watch the orbital overlap between atoms as they bond. Electron density is concentrated between nuclei.</p>
                          </div>
                       </div>

                       <div className="pt-6 border-t border-white/5">
                          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                             Full Analysis <CheckCircle2 size={18} />
                          </button>
                       </div>
                    </motion.div>
                 ) : (
                    <motion.div
                       key="theory"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="h-full flex flex-col items-center justify-center text-center"
                    >
                       <div className="w-full p-8 rounded-3xl bg-black/40 border border-cyan-500/30 flex items-center justify-center mb-8">
                          <span className="text-4xl font-mono tracking-widest font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                             {selectedMolecule.lewis}
                          </span>
                       </div>
                       <p className="text-white/40 text-sm leading-relaxed">
                          The Lewis structure represents valence electrons and helps predict the molecular geometry via VSEPR theory.
                       </p>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};
