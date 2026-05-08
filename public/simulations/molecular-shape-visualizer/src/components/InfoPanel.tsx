import { motion, AnimatePresence } from "framer-motion";
import type { MoleculeData } from "../data/molecules";

interface InfoPanelProps {
  molecule: MoleculeData;
}

const polarityIcon = (polarity: string) =>
  polarity === "Polar" ? "⚡" : "⚖️";

export function InfoPanel({ molecule }: InfoPanelProps) {
  const fields = [
    { label: "Molecular Geometry", value: molecule.geometry, icon: "🔷" },
    { label: "Electron Geometry", value: molecule.electronGeometry, icon: "⚛️" },
    { label: "Hybridization", value: molecule.hybridization, icon: "🧬" },
    { label: "Bond Angle", value: molecule.bondAngle, icon: "📐" },
    { label: "Polarity", value: molecule.polarity, icon: polarityIcon(molecule.polarity) },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={molecule.formula}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-3"
      >
        {/* Molecule Header */}
        <div
          className="rounded-2xl p-4 border"
          style={{
            background: `linear-gradient(135deg, ${molecule.color}18, ${molecule.accentColor}10)`,
            borderColor: `${molecule.color}40`,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{ background: `${molecule.color}30`, border: `1px solid ${molecule.color}60` }}
            >
              🧪
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{molecule.name}</h2>
              <p
                className="text-sm font-mono font-bold"
                style={{ color: molecule.color }}
              >
                {molecule.formula}
              </p>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 gap-2">
          {fields.map((field, i) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="flex items-center justify-between rounded-xl px-4 py-2.5 border"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{field.icon}</span>
                <span className="text-xs text-gray-400 font-medium">{field.label}</span>
              </div>
              <span
                className="text-sm font-bold font-mono"
                style={{ color: molecule.color }}
              >
                {field.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* VSEPR Electron Pairs */}
        <div
          className="rounded-xl p-3 border"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">
            VSEPR Pairs
          </p>
          <div className="flex gap-3">
            <div className="flex-1 text-center rounded-lg py-2" style={{ background: "rgba(100,200,255,0.1)", border: "1px solid rgba(100,200,255,0.2)" }}>
              <p className="text-lg font-bold text-cyan-300">{molecule.vsepPairs.bonding}</p>
              <p className="text-xs text-gray-400">Bonding</p>
            </div>
            <div className="flex-1 text-center rounded-lg py-2" style={{ background: "rgba(255,100,255,0.1)", border: "1px solid rgba(255,100,255,0.2)" }}>
              <p className="text-lg font-bold text-fuchsia-300">{molecule.vsepPairs.lonePairs}</p>
              <p className="text-xs text-gray-400">Lone Pairs</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl p-3 border"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">
            📚 Educational Note
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">{molecule.description}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
