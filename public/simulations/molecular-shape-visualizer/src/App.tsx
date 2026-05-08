import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { MOLECULES, type MoleculeData } from "./data/molecules";
import { MoleculeScene } from "./components/MoleculeScene";
import { InfoPanel } from "./components/InfoPanel";
import { MoleculeSelector } from "./components/MoleculeSelector";
import { ControlPanel } from "./components/ControlPanel";
import { ComparePanel } from "./components/ComparePanel";
import { VSEPRGuide } from "./components/VSEPRGuide";
import { AtomLegend } from "./components/AtomLegend";

export default function App() {
  const [selectedMol, setSelectedMol] = useState("H2O");
  const [compareMol, setCompareMol] = useState("CH4");
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showBondAngles, setShowBondAngles] = useState(true);
  const [animateRepulsion, setAnimateRepulsion] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "guide">("info");
  const [mobilePanel, setMobilePanel] = useState<"left" | "right" | null>(null);

  const molecule = MOLECULES[selectedMol];
  const compareMolecule = MOLECULES[compareMol];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: "#050b18",
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, -10, 0], y: [0, -30, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            top: "-220px",
            left: "-120px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -50, 20, 0], y: [0, 40, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute"
          style={{
            bottom: "-200px",
            right: "-120px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)",
            filter: "blur(55px)",
          }}
        />
        <motion.div
          animate={{ x: [0, 25, -20, 0], y: [0, -20, 35, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute"
          style={{
            top: "35%",
            right: "15%",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />
      </div>

      {/* ── HEADER ── */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-20 px-4 py-2.5 flex items-center justify-between border-b"
        style={{
          background: "rgba(5, 11, 24, 0.85)",
          backdropFilter: "blur(24px)",
          borderColor: "rgba(255,255,255,0.06)",
          minHeight: "54px",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(168,85,247,0.25))",
              border: "1px solid rgba(6,182,212,0.35)",
            }}
          >
            ⚗️
          </motion.div>
          <div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-base font-black tracking-tight"
                style={{ color: "#06b6d4", textShadow: "0 0 18px rgba(6,182,212,0.7)" }}
              >
                Molecu
              </span>
              <span
                className="text-base font-black tracking-tight"
                style={{ color: "#a855f7", textShadow: "0 0 18px rgba(168,85,247,0.7)" }}
              >
                Lab
              </span>
              <span className="text-[10px] text-gray-500 font-medium ml-1 hidden sm:inline">3D</span>
            </div>
            <p className="text-[9px] text-gray-600 leading-none hidden sm:block">
              VSEPR Molecular Visualizer • NEB +2 Chemistry
            </p>
          </div>
        </div>

        {/* Center: Molecule badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMol + compareMode}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 border"
            style={{
              background: `linear-gradient(135deg, ${molecule.color}22, ${molecule.accentColor}12)`,
              borderColor: `${molecule.color}45`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
              style={{ background: molecule.color, boxShadow: `0 0 8px ${molecule.color}` }}
            />
            <span className="text-xs font-mono font-bold" style={{ color: molecule.color }}>
              {molecule.formula}
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">
              {molecule.geometry}
            </span>
            {compareMode && (
              <>
                <span className="text-gray-600 text-[10px]">vs</span>
                <span className="text-xs font-mono font-bold" style={{ color: compareMolecule.color }}>
                  {compareMolecule.formula}
                </span>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Right: Hints + Mobile buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 hidden lg:block">🖱️ Drag · Scroll to zoom</span>
          {/* Mobile panel toggles */}
          <button
            onClick={() => setMobilePanel(mobilePanel === "left" ? null : "left")}
            className="lg:hidden p-1.5 rounded-lg border text-[10px] text-gray-400"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            ☰
          </button>
          <button
            onClick={() => setMobilePanel(mobilePanel === "right" ? null : "right")}
            className="lg:hidden p-1.5 rounded-lg border text-[10px] text-gray-400"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            📊
          </button>
        </div>
      </motion.header>

      {/* ── MAIN LAYOUT ── */}
      <div className="absolute inset-0 pt-[54px] flex overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <motion.div
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          className="hidden lg:flex flex-col w-[272px] flex-shrink-0 border-r overflow-y-auto"
          style={{
            background: "rgba(5, 11, 24, 0.78)",
            backdropFilter: "blur(22px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <LeftPanelContent
            selectedMol={selectedMol}
            setSelectedMol={setSelectedMol}
            compareMol={compareMol}
            setCompareMol={setCompareMol}
            showLonePairs={showLonePairs}
            setShowLonePairs={setShowLonePairs}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
            showBondAngles={showBondAngles}
            setShowBondAngles={setShowBondAngles}
            animateRepulsion={animateRepulsion}
            setAnimateRepulsion={setAnimateRepulsion}
            compareMode={compareMode}
            setCompareMode={setCompareMode}
          />
        </motion.div>

        {/* Mobile Left Panel */}
        <AnimatePresence>
          {mobilePanel === "left" && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden absolute left-0 top-0 bottom-0 z-30 w-[272px] flex flex-col border-r overflow-y-auto"
              style={{
                background: "rgba(5, 11, 24, 0.96)",
                backdropFilter: "blur(24px)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <LeftPanelContent
                selectedMol={selectedMol}
                setSelectedMol={(k) => { setSelectedMol(k); setMobilePanel(null); }}
                compareMol={compareMol}
                setCompareMol={setCompareMol}
                showLonePairs={showLonePairs}
                setShowLonePairs={setShowLonePairs}
                showLabels={showLabels}
                setShowLabels={setShowLabels}
                showBondAngles={showBondAngles}
                setShowBondAngles={setShowBondAngles}
                animateRepulsion={animateRepulsion}
                setAnimateRepulsion={setAnimateRepulsion}
                compareMode={compareMode}
                setCompareMode={setCompareMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 3D CANVAS ── */}
        <div className="flex-1 relative overflow-hidden">
          {compareMode ? (
            <div className="w-full h-full flex">
              {/* Primary */}
              <div className="flex-1 relative border-r" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <MoleculeLabel molecule={molecule} position="primary" />
                <Canvas
                  camera={{ position: [0, 0, 7], fov: 45 }}
                  gl={{ antialias: true, alpha: true }}
                  style={{ background: "transparent" }}
                >
                  <Suspense fallback={null}>
                    <MoleculeScene
                      molecule={molecule}
                      showLonePairs={showLonePairs}
                      showLabels={showLabels}
                      showBondAngles={showBondAngles}
                      animateRepulsion={animateRepulsion}
                    />
                  </Suspense>
                </Canvas>
                <AtomLegend molecule={molecule} showLonePairs={showLonePairs} />
              </div>
              {/* Compare */}
              <div className="flex-1 relative">
                <MoleculeLabel molecule={compareMolecule} position="compare" />
                <Canvas
                  camera={{ position: [0, 0, 7], fov: 45 }}
                  gl={{ antialias: true, alpha: true }}
                  style={{ background: "transparent" }}
                >
                  <Suspense fallback={null}>
                    <MoleculeScene
                      molecule={compareMolecule}
                      showLonePairs={showLonePairs}
                      showLabels={showLabels}
                      showBondAngles={showBondAngles}
                      animateRepulsion={animateRepulsion}
                    />
                  </Suspense>
                </Canvas>
                <AtomLegend molecule={compareMolecule} showLonePairs={showLonePairs} />
              </div>
            </div>
          ) : (
            <>
              <Canvas
                camera={{ position: [0, 0, 7], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
              >
                <Suspense fallback={null}>
                  <MoleculeScene
                    molecule={molecule}
                    showLonePairs={showLonePairs}
                    showLabels={showLabels}
                    showBondAngles={showBondAngles}
                    animateRepulsion={animateRepulsion}
                  />
                </Suspense>
              </Canvas>
              <AtomLegend molecule={molecule} showLonePairs={showLonePairs} />
            </>
          )}

          {/* Drag hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-700 font-mono pointer-events-none"
          >
            drag to rotate · pinch / scroll to zoom
          </motion.p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          initial={{ x: 280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          className="hidden lg:flex flex-col w-[272px] flex-shrink-0 border-l overflow-y-auto"
          style={{
            background: "rgba(5, 11, 24, 0.78)",
            backdropFilter: "blur(22px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <RightPanelContent
            molecule={molecule}
            compareMolecule={compareMolecule}
            compareMode={compareMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </motion.div>

        {/* Mobile Right Panel */}
        <AnimatePresence>
          {mobilePanel === "right" && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden absolute right-0 top-0 bottom-0 z-30 w-[272px] flex flex-col border-l overflow-y-auto"
              style={{
                background: "rgba(5, 11, 24, 0.96)",
                backdropFilter: "blur(24px)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <RightPanelContent
                molecule={molecule}
                compareMolecule={compareMolecule}
                compareMode={compareMode}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile tap-outside-to-close overlay */}
      <AnimatePresence>
        {mobilePanel !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobilePanel(null)}
            className="lg:hidden absolute inset-0 z-20"
            style={{ background: "rgba(0,0,0,0.5)" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── SUB-COMPONENTS ── */

function MoleculeLabel({
  molecule,
  position,
}: {
  molecule: ReturnType<typeof Object.values<typeof MOLECULES>>[0];
  position: "primary" | "compare";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1 rounded-full border"
      style={{
        background: `${molecule.color}18`,
        borderColor: `${molecule.color}50`,
        backdropFilter: "blur(10px)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: molecule.color, boxShadow: `0 0 6px ${molecule.color}` }}
      />
      <span className="text-[11px] font-mono font-bold" style={{ color: molecule.color }}>
        {molecule.formula}
      </span>
      <span className="text-[10px] text-gray-400">{molecule.geometry}</span>
      {position === "compare" && (
        <span className="text-[9px] text-gray-600 ml-1">← compare</span>
      )}
    </motion.div>
  );
}

function LeftPanelContent({
  selectedMol,
  setSelectedMol,
  compareMol,
  setCompareMol,
  showLonePairs,
  setShowLonePairs,
  showLabels,
  setShowLabels,
  showBondAngles,
  setShowBondAngles,
  animateRepulsion,
  setAnimateRepulsion,
  compareMode,
  setCompareMode,
}: {
  selectedMol: string;
  setSelectedMol: (k: string) => void;
  compareMol: string;
  setCompareMol: (k: string) => void;
  showLonePairs: boolean;
  setShowLonePairs: (v: boolean) => void;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
  showBondAngles: boolean;
  setShowBondAngles: (v: boolean) => void;
  animateRepulsion: boolean;
  setAnimateRepulsion: (v: boolean) => void;
  compareMode: boolean;
  setCompareMode: (v: boolean) => void;
}) {
  return (
    <div className="p-3 flex flex-col gap-3 h-full">
      {/* Panel title */}
      <div className="flex items-center gap-2 pb-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
          Molecules
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>

      <MoleculeSelector
        selected={selectedMol}
        onSelect={setSelectedMol}
        compareMode={compareMode}
        compareSelected={compareMol}
        onCompareSelect={setCompareMol}
      />

      <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

      <ControlPanel
        showLonePairs={showLonePairs}
        setShowLonePairs={setShowLonePairs}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        showBondAngles={showBondAngles}
        setShowBondAngles={setShowBondAngles}
        animateRepulsion={animateRepulsion}
        setAnimateRepulsion={setAnimateRepulsion}
        compareMode={compareMode}
        setCompareMode={setCompareMode}
      />

      <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

      <VSEPRGuide />

      {/* Footer */}
      <div className="mt-auto pt-2 pb-1">
        <p className="text-[9px] text-gray-700 text-center">
          NEB +2 Chemistry • VSEPR Theory
        </p>
      </div>
    </div>
  );
}

function RightPanelContent({
  molecule,
  compareMolecule,
  compareMode,
  activeTab,
  setActiveTab,
}: {
  molecule: ReturnType<typeof Object.values<typeof MOLECULES>>[0];
  compareMolecule: ReturnType<typeof Object.values<typeof MOLECULES>>[0];
  compareMode: boolean;
  activeTab: "info" | "guide";
  setActiveTab: (t: "info" | "guide") => void;
}) {
  return (
    <div className="p-3 flex flex-col gap-3">
      {/* Tabs */}
      <div
        className="flex rounded-xl p-0.5 border"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        {(["info", "guide"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200"
            style={{
              background:
                activeTab === tab
                  ? "linear-gradient(135deg, rgba(6,182,212,0.22), rgba(168,85,247,0.14))"
                  : "transparent",
              color: activeTab === tab ? "#e2e8f0" : "#64748b",
              border: activeTab === tab
                ? "1px solid rgba(6,182,212,0.3)"
                : "1px solid transparent",
            }}
          >
            {tab === "info" ? "📊 Properties" : "📚 VSEPR"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "info" ? (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-3"
          >
            <InfoPanel molecule={molecule} />
            {compareMode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">
                  ⚖️ Comparison Table
                </p>
                <ComparePanel mol1={molecule} mol2={compareMolecule} />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="guide"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            <VSEPRTheoryGuide />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VSEPRTheoryGuide() {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="rounded-xl p-3 border"
        style={{ background: "rgba(6,182,212,0.07)", borderColor: "rgba(6,182,212,0.2)" }}
      >
        <h3 className="text-xs font-bold text-cyan-300 mb-1.5 flex items-center gap-1">
          <span>⚛️</span> What is VSEPR?
        </h3>
        <p className="text-[11px] text-gray-300 leading-relaxed">
          <strong className="text-cyan-400">V</strong>alence{" "}
          <strong className="text-cyan-400">S</strong>hell{" "}
          <strong className="text-cyan-400">E</strong>lectron{" "}
          <strong className="text-cyan-400">P</strong>air{" "}
          <strong className="text-cyan-400">R</strong>epulsion theory predicts the 3D geometry of
          molecules by minimizing repulsion between electron pairs around the central atom.
        </p>
      </div>

      <div
        className="rounded-xl p-3 border"
        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-medium">
          Repulsion Strength Order
        </p>
        <div className="flex items-center justify-center gap-2 text-xs font-mono py-1">
          <span className="text-fuchsia-400 font-bold">LP–LP</span>
          <span className="text-gray-600 text-base">›</span>
          <span className="text-yellow-400 font-bold">LP–BP</span>
          <span className="text-gray-600 text-base">›</span>
          <span className="text-cyan-400 font-bold">BP–BP</span>
        </div>
        <p className="text-[10px] text-gray-500 text-center mt-1">
          Lone pairs compress bond angles
        </p>
      </div>

      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">
          Hybridization → Geometry
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            { hyb: "sp", groups: "2", angle: "180°", color: "#f59e0b", shape: "Linear" },
            { hyb: "sp²", groups: "3", angle: "120°", color: "#22c55e", shape: "Trigonal Planar" },
            { hyb: "sp³", groups: "4", angle: "109.5°", color: "#06b6d4", shape: "Tetrahedral" },
            { hyb: "sp³d", groups: "5", angle: "90°/120°", color: "#ec4899", shape: "Trig. Bipyr." },
            { hyb: "sp³d²", groups: "6", angle: "90°", color: "#f97316", shape: "Octahedral" },
          ].map((h) => (
            <div
              key={h.hyb}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 border"
              style={{ background: `${h.color}0d`, borderColor: `${h.color}28` }}
            >
              <span className="text-[11px] font-mono font-bold w-12 flex-shrink-0" style={{ color: h.color }}>
                {h.hyb}
              </span>
              <span className="text-[10px] text-gray-400 flex-1">{h.shape}</span>
              <span className="text-[10px] font-mono text-gray-500">{h.angle}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-3 border"
        style={{ background: "rgba(168,85,247,0.07)", borderColor: "rgba(168,85,247,0.2)" }}
      >
        <h3 className="text-[11px] font-bold text-purple-300 mb-1.5">💡 Key Rules</h3>
        <ul className="text-[10px] text-gray-400 leading-relaxed space-y-1">
          <li className="flex gap-1.5"><span className="text-purple-400">→</span> Count <em>electron groups</em>, not atoms</li>
          <li className="flex gap-1.5"><span className="text-purple-400">→</span> Each bond (single/double/triple) = 1 group</li>
          <li className="flex gap-1.5"><span className="text-purple-400">→</span> More lone pairs = smaller bond angles</li>
          <li className="flex gap-1.5"><span className="text-purple-400">→</span> Asymmetry + polar bonds = polar molecule</li>
        </ul>
      </div>

      <div
        className="rounded-xl p-3 border"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-[11px] font-bold text-gray-300 mb-1.5">🎯 NEB +2 Exam Tips</h3>
        <ul className="text-[10px] text-gray-500 leading-relaxed space-y-1">
          <li className="flex gap-1.5"><span className="text-cyan-600">•</span> H₂O: bent, sp³, 104.5°, polar</li>
          <li className="flex gap-1.5"><span className="text-cyan-600">•</span> NH₃: trig. pyramidal, sp³, 107°, polar</li>
          <li className="flex gap-1.5"><span className="text-cyan-600">•</span> CO₂: linear, sp, 180°, nonpolar</li>
          <li className="flex gap-1.5"><span className="text-cyan-600">•</span> CH₄: tetrahedral, sp³, 109.5°, nonpolar</li>
          <li className="flex gap-1.5"><span className="text-cyan-600">•</span> PCl₅: trig bipyr, sp³d, expanded octet</li>
          <li className="flex gap-1.5"><span className="text-cyan-600">•</span> SF₆: octahedral, sp³d², nonpolar</li>
        </ul>
      </div>
    </div>
  );
}
