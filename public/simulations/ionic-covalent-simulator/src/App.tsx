import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtomData, MoleculePreset, MOLECULE_PRESETS, getAtomBySymbol } from './data/atomData';
import PeriodicTablePicker from './components/PeriodicTablePicker';
import BondingArena from './components/BondingArena';
import MoleculeInfoPanel from './components/MoleculeInfoPanel';
import Molecule3D from './components/Molecule3D';
import ScoreBoard from './components/ScoreBoard';
import ParticleEffect from './components/ParticleEffect';
import ElectronShell from './components/ElectronShell';

interface PlacedAtom {
  id: string;
  atom: AtomData;
  x: number;
  y: number;
}

let atomIdCounter = 0;

const determineBondType = (atoms: AtomData[]): 'ionic' | 'covalent' | 'polar_covalent' | null => {
  if (atoms.length < 2) return null;
  const en1 = atoms[0].electronegativity;
  const en2 = atoms[1].electronegativity;
  const diff = Math.abs(en1 - en2);
  if (atoms.some((a) => a.category === 'metal') && atoms.some((a) => a.category === 'nonmetal')) {
    return diff >= 1.7 ? 'ionic' : 'polar_covalent';
  }
  if (diff >= 1.7) return 'ionic';
  if (diff >= 0.4) return 'polar_covalent';
  return 'covalent';
};

const findMatchingPreset = (atoms: AtomData[]): MoleculePreset | null => {
  const symbols = atoms.map((a) => a.symbol).sort().join('');
  for (const preset of MOLECULE_PRESETS) {
    const presetSymbols = [...preset.atoms].sort().join('');
    if (presetSymbols === symbols) return preset;
  }
  return null;
};

function App() {
  const [placedAtoms, setPlacedAtoms] = useState<PlacedAtom[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<MoleculePreset | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [activeTab, setActiveTab] = useState<'build' | 'presets'>('presets');
  const [view3D, setView3D] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [bondsFormed, setBondsFormed] = useState(0);
  const [achievement, setAchievement] = useState<string | null>(null);
  const [_dragAtom, _setDragAtom] = useState<AtomData | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const bondType = placedAtoms.length >= 2 ? determineBondType(placedAtoms.map((p) => p.atom)) : null;

  const playSound = useCallback((type: 'bond' | 'drop' | 'success' | 'select') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      switch (type) {
        case 'select':
          oscillator.frequency.setValueAtTime(440, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          break;
        case 'drop':
          oscillator.frequency.setValueAtTime(300, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          break;
        case 'bond':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523, ctx.currentTime);
          oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          break;
        case 'success':
          oscillator.type = 'sine';
          [523, 659, 784, 1046].forEach((freq, i) => {
            oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
          });
          gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          break;
      }

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.7);
    } catch (_) {}
  }, []);

  const triggerAchievement = useCallback((msg: string) => {
    setAchievement(msg);
    setTimeout(() => setAchievement(null), 3000);
  }, []);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const handleBond = useCallback(() => {
    if (placedAtoms.length < 2) return;
    setIsAnimating(true);
    setShowParticles(true);
    playSound('bond');

    const points = bondType === 'ionic' ? 150 : bondType === 'polar_covalent' ? 120 : 100;
    const newStreak = streak + 1;
    const multiplier = Math.min(newStreak, 5);
    const earned = points * multiplier;

    setTimeout(() => {
      setScore((s) => {
        const ns = s + earned;
        const newLevel = Math.floor(ns / 300) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          triggerAchievement(`⬆️ Level Up! You're now Level ${newLevel}!`);
          playSound('success');
        }
        return ns;
      });
      setStreak(newStreak);
      setBondsFormed((b) => b + 1);
      setIsAnimating(false);
      setShowParticles(false);
      showNotification(`+${earned} XP! ${newStreak > 1 ? `🔥 ${newStreak}x Streak!` : ''}`);

      if (bondsFormed === 4) triggerAchievement('🔬 Bond Enthusiast — 5 bonds formed!');
      if (bondsFormed === 9) triggerAchievement('⚗️ Lab Expert — 10 bonds formed!');
    }, 1800);
  }, [placedAtoms, bondType, streak, level, bondsFormed, playSound, triggerAchievement, showNotification]);

  const handleAtomDrop = useCallback((atom: AtomData, x: number, y: number) => {
    playSound('drop');
    setPlacedAtoms((prev) => [
      ...prev,
      { id: `atom-${++atomIdCounter}`, atom, x, y },
    ]);
  }, [playSound]);

  const handleAtomMove = useCallback((id: string, x: number, y: number) => {
    setPlacedAtoms((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
  }, []);

  const handleAtomRemove = useCallback((id: string) => {
    setPlacedAtoms((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleSelectAtomFromTable = useCallback((atom: AtomData) => {
    playSound('select');
    // Place at random position in arena
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 60;
    setPlacedAtoms((prev) => [
      ...prev,
      { id: `atom-${++atomIdCounter}`, atom, x, y },
    ]);
  }, [playSound]);

  const handleSelectPreset = useCallback((preset: MoleculePreset) => {
    playSound('select');
    setSelectedPreset(preset);
    // Place atoms from preset in the arena
    const positions: [number, number][] =
      preset.atoms.length === 2
        ? [[30, 50], [70, 50]]
        : preset.atoms.length === 3
        ? [[20, 50], [50, 50], [80, 50]]
        : preset.atoms.length === 4
        ? [[50, 20], [20, 60], [80, 60], [50, 80]]
        : [[50, 20], [15, 45], [85, 45], [30, 80], [70, 80]];

    const newAtoms: PlacedAtom[] = preset.atoms.map((sym, i) => {
      const atom = getAtomBySymbol(sym);
      return {
        id: `atom-${++atomIdCounter}`,
        atom: atom!,
        x: positions[i]?.[0] ?? 50,
        y: positions[i]?.[1] ?? 50,
      };
    });
    setPlacedAtoms(newAtoms);
    setIsAnimating(false);
  }, [playSound]);

  const handleClearArena = useCallback(() => {
    setPlacedAtoms([]);
    setSelectedPreset(null);
    setIsAnimating(false);
  }, []);

  // Auto-detect preset from placed atoms
  useEffect(() => {
    if (placedAtoms.length >= 2) {
      const matched = findMatchingPreset(placedAtoms.map((p) => p.atom));
      if (matched) setSelectedPreset(matched);
      else setSelectedPreset(null);
    } else {
      setSelectedPreset(null);
    }
  }, [placedAtoms]);

  const handleQuizSubmit = () => {
    if (!selectedPreset) return;
    const correct = quizAnswer.trim().toLowerCase() === selectedPreset.formula.toLowerCase()
      || quizAnswer.trim().toLowerCase() === selectedPreset.name.toLowerCase();
    setQuizFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore((s) => s + 50);
      playSound('success');
      triggerAchievement('🧠 Quiz Master! +50 XP');
    }
    setTimeout(() => {
      setQuizFeedback(null);
      setQuizAnswer('');
      setShowQuiz(false);
    }, 2000);
  };

  const bondTypeColors: Record<string, string> = {
    ionic: '#FDBA74',
    covalent: '#34D399',
    polar_covalent: '#A78BFA',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#60A5FA', '#A78BFA', '#34D399', '#F472B6'][i % 4],
              boxShadow: `0 0 6px ${['#60A5FA', '#A78BFA', '#34D399', '#F472B6'][i % 4]}`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 z-[100] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-xl rounded-2xl px-6 py-3 text-cyan-300 font-bold text-sm font-orbitron"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="text-2xl"
              >
                ⚛️
              </motion.div>
              <div>
                <h1 className="text-lg font-black font-orbitron bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-none">
                  ChemBond Simulator
                </h1>
                <p className="text-[10px] text-slate-500 font-rajdhani tracking-widest uppercase">NEB +2 Chemistry • Interactive Learning</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Score display */}
              <div className="hidden sm:flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-1.5">
                <span className="text-yellow-400 font-orbitron font-bold text-sm">⭐ {score.toLocaleString()}</span>
                <span className="text-slate-500">|</span>
                <span className="text-red-400 font-rajdhani text-sm">🔥 {streak}x</span>
                <span className="text-slate-500">|</span>
                <span className="text-green-400 font-rajdhani text-sm">Lv.{level}</span>
              </div>

              {/* 3D Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView3D(!view3D)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-orbitron border transition-all ${
                  view3D
                    ? 'bg-blue-500/20 border-blue-500/60 text-blue-300'
                    : 'bg-slate-800/60 border-slate-600/50 text-slate-400'
                }`}
              >
                {view3D ? '3D ON' : '3D OFF'}
              </motion.button>

              {/* Quiz button */}
              {selectedPreset && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQuiz(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold font-orbitron bg-purple-500/20 border border-purple-500/60 text-purple-300"
                >
                  🧠 Quiz
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 text-sm"
              >
                {sidebarOpen ? '◀' : '▶'}
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden gap-0">

          {/* Left sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 border-r border-slate-700/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden flex flex-col"
              >
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {/* Tab switcher */}
                  <div className="flex bg-slate-800/60 rounded-xl p-1 border border-slate-700/40">
                    {(['presets', 'build'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-orbitron transition-all ${
                          activeTab === tab
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {tab === 'presets' ? '🧪 Presets' : '⚗️ Build'}
                      </button>
                    ))}
                  </div>

                  {/* Presets tab */}
                  {activeTab === 'presets' && (
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500 font-orbitron uppercase tracking-wider px-1">Common Molecules</div>
                      {MOLECULE_PRESETS.map((preset) => (
                        <motion.button
                          key={preset.id}
                          whileHover={{ scale: 1.02, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPreset(preset)}
                          className={`w-full text-left rounded-xl border p-3 transition-all ${
                            selectedPreset?.id === preset.id
                              ? 'border-cyan-500/60 bg-cyan-500/10'
                              : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600/80 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="text-base font-black font-orbitron"
                              style={{ color: preset.color }}
                            >
                              {preset.formula}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-rajdhani font-bold ${
                              preset.bondType === 'ionic'
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                : preset.bondType === 'polar_covalent'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-green-500/20 text-green-300 border border-green-500/30'
                            }`}>
                              {preset.bondType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-rajdhani">{preset.name}</div>
                          <div className="text-[10px] text-slate-600 mt-0.5">{preset.geometry}</div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Build tab - Periodic Table */}
                  {activeTab === 'build' && (
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500 font-orbitron uppercase tracking-wider px-1">
                        Click to add atoms
                      </div>
                      <PeriodicTablePicker
                        onSelectAtom={handleSelectAtomFromTable}
                        selectedAtoms={placedAtoms.map((p) => p.atom)}
                      />
                    </div>
                  )}

                  {/* Score board */}
                  <div className="border-t border-slate-700/50 pt-3">
                    <ScoreBoard
                      score={score}
                      streak={streak}
                      level={level}
                      bondsFormed={bondsFormed}
                      achievement={achievement}
                    />
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Center arena */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Arena toolbar */}
            <div className="flex-shrink-0 px-3 py-2 bg-slate-900/40 border-b border-slate-700/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {bondType && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-orbitron font-bold"
                    style={{
                      borderColor: `${bondTypeColors[bondType]}60`,
                      background: `${bondTypeColors[bondType]}15`,
                      color: bondTypeColors[bondType],
                    }}
                  >
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      ⚡
                    </motion.span>
                    {bondType.replace('_', ' ').toUpperCase()} DETECTED
                  </motion.div>
                )}
                {placedAtoms.length > 0 && (
                  <span className="text-xs text-slate-500 font-rajdhani">
                    {placedAtoms.length} atom{placedAtoms.length > 1 ? 's' : ''} in arena
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {placedAtoms.length >= 2 && !isAnimating && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ boxShadow: ['0 0 10px #60A5FA40', '0 0 25px #60A5FA80', '0 0 10px #60A5FA40'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    onClick={handleBond}
                    className="px-4 py-1.5 rounded-xl font-bold text-xs font-orbitron bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border border-blue-400/60 transition-all"
                  >
                    ⚡ Form Bond!
                  </motion.button>
                )}
                {isAnimating && (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-orbitron">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}>
                      ⚙️
                    </motion.span>
                    Bonding...
                  </div>
                )}
                {placedAtoms.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearArena}
                    className="px-3 py-1.5 rounded-xl text-xs font-orbitron bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    🗑️ Clear
                  </motion.button>
                )}
              </div>
            </div>

            {/* Arena + 3D split */}
            <div className="flex-1 flex overflow-hidden">
              {/* Bonding arena */}
              <div className="flex-1 relative p-2">
                <div className="w-full h-full rounded-2xl border border-slate-700/50 overflow-hidden relative">
                  <BondingArena
                    placedAtoms={placedAtoms}
                    onAtomDrop={handleAtomDrop}
                    onAtomMove={handleAtomMove}
                    onAtomRemove={handleAtomRemove}
                    bondType={bondType}
                    isAnimating={isAnimating}
                    dragAtom={_dragAtom}
                  />
                  {showParticles && (
                    <ParticleEffect
                      active={showParticles}
                      color={bondType ? bondTypeColors[bondType] : '#60A5FA'}
                    />
                  )}
                </div>
              </div>

              {/* 3D view */}
              {view3D && selectedPreset && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex-shrink-0 p-2 pl-0"
                >
                  <div className="h-full rounded-2xl border border-slate-700/50 bg-slate-900/60 overflow-hidden flex flex-col">
                    <div className="px-3 py-2 border-b border-slate-700/40 flex items-center justify-between">
                      <span className="text-xs font-orbitron text-slate-400 uppercase tracking-wider">3D View</span>
                      <span className="text-[10px] text-slate-600 font-rajdhani">Drag to rotate • Scroll to zoom</span>
                    </div>
                    <div className="flex-1">
                      <Molecule3D preset={selectedPreset} />
                    </div>
                    <div className="px-3 py-2 border-t border-slate-700/40 text-center">
                      <span
                        className="text-sm font-black font-orbitron"
                        style={{ color: selectedPreset.color, textShadow: `0 0 10px ${selectedPreset.color}` }}
                      >
                        {selectedPreset.formula}
                      </span>
                      <span className="text-xs text-slate-500 ml-2 font-rajdhani">{selectedPreset.geometry}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </main>

          {/* Right panel - Info */}
          <aside className="flex-shrink-0 w-64 border-l border-slate-700/50 bg-slate-900/60 backdrop-blur-xl flex flex-col overflow-hidden">
            {/* Atom detail cards */}
            {placedAtoms.length > 0 && (
              <div className="flex-shrink-0 border-b border-slate-700/40 p-3">
                <div className="text-xs text-slate-500 font-orbitron uppercase tracking-wider mb-2">Atoms in Arena</div>
                <div className="flex flex-wrap gap-2">
                  {placedAtoms.slice(0, 4).map((pa, _i) => (
                    <motion.div
                      key={pa.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex flex-col items-center"
                    >
                      <ElectronShell atom={pa.atom} size={48} animated={false} />
                      <span className="text-[9px] mt-0.5 font-orbitron" style={{ color: pa.atom.color }}>
                        {pa.atom.symbol}
                      </span>
                    </motion.div>
                  ))}
                  {placedAtoms.length > 4 && (
                    <div className="flex items-center text-slate-500 text-xs font-rajdhani">
                      +{placedAtoms.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Molecule info */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="text-xs text-slate-500 font-orbitron uppercase tracking-wider mb-2">Bond Info</div>
              <MoleculeInfoPanel preset={selectedPreset} isAnimating={isAnimating} />
            </div>

            {/* Bond angle visual */}
            {selectedPreset?.bondAngle && (
              <div className="flex-shrink-0 border-t border-slate-700/40 p-3">
                <div className="text-xs text-slate-500 font-orbitron uppercase tracking-wider mb-2">Bond Angle</div>
                <BondAngleViz angle={selectedPreset.bondAngle} color={selectedPreset.color} />
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && selectedPreset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-900 border border-slate-600 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            >
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">🧠</div>
                <h3 className="text-lg font-black font-orbitron text-white">Quick Quiz!</h3>
                <p className="text-slate-400 text-sm mt-1 font-rajdhani">+50 XP for correct answer</p>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-4 mb-4 text-center">
                <p className="text-slate-300 text-sm font-rajdhani">
                  What is the chemical formula or name of the molecule with{' '}
                  <span className="text-cyan-400 font-bold">{selectedPreset.geometry}</span> geometry
                  and a bond angle of{' '}
                  <span className="text-cyan-400 font-bold">{selectedPreset.bondAngle ?? 'N/A'}°</span>?
                </p>
              </div>

              <input
                type="text"
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuizSubmit()}
                placeholder="Type formula or name..."
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm font-rajdhani outline-none focus:border-cyan-500/60 mb-3"
              />

              {quizFeedback && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`text-center py-2 rounded-xl mb-3 font-bold font-orbitron text-sm ${
                    quizFeedback === 'correct'
                      ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {quizFeedback === 'correct' ? '✅ Correct! +50 XP' : `❌ Try again! Answer: ${selectedPreset.formula} / ${selectedPreset.name}`}
                </motion.div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => { setShowQuiz(false); setQuizAnswer(''); setQuizFeedback(null); }}
                  className="flex-1 py-2 rounded-xl border border-slate-600 text-slate-400 text-sm font-rajdhani hover:border-slate-500 transition-all"
                >
                  Skip
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQuizSubmit}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold font-orbitron hover:from-blue-500 hover:to-cyan-500 transition-all"
                >
                  Submit
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Bond Angle Visualization component
const BondAngleViz: React.FC<{ angle: number; color: string }> = ({ angle, color }) => {
  const r = 40;
  const cx = 60;
  const cy = 60;
  const angleRad = (angle * Math.PI) / 180;
  const half = angleRad / 2;

  const x1 = cx + r * Math.cos(Math.PI / 2 + half);
  const y1 = cy - r * Math.sin(Math.PI / 2 + half);
  const x2 = cx + r * Math.cos(Math.PI / 2 - half);
  const y2 = cy - r * Math.sin(Math.PI / 2 - half);

  const arcR = 18;
  const arcX1 = cx + arcR * Math.cos(Math.PI / 2 + half);
  const arcY1 = cy - arcR * Math.sin(Math.PI / 2 + half);
  const arcX2 = cx + arcR * Math.cos(Math.PI / 2 - half);
  const arcY2 = cy - arcR * Math.sin(Math.PI / 2 - half);
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <svg viewBox="0 0 120 80" className="w-full h-16">
      <line x1={cx} y1={cy} x2={x1} y2={y1} stroke={color} strokeWidth="2" opacity="0.8" />
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth="2" opacity="0.8" />
      <path
        d={`M ${arcX1} ${arcY1} A ${arcR} ${arcR} 0 ${largeArc} 0 ${arcX2} ${arcY2}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
      />
      <circle cx={cx} cy={cy} r="4" fill={color} opacity="0.9" />
      <circle cx={x1} cy={y1} r="3" fill="#60A5FA" opacity="0.8" />
      <circle cx={x2} cy={y2} r="3" fill="#60A5FA" opacity="0.8" />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="9" fill={color} fontFamily="Orbitron, sans-serif">
        {angle}°
      </text>
    </svg>
  );
};

export default App;
