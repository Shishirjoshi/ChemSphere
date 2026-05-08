import { motion } from "framer-motion";
import type { MoleculeData } from "../data/molecules";

interface AtomLegendProps {
  molecule: MoleculeData;
  showLonePairs: boolean;
}

export function AtomLegend({ molecule, showLonePairs }: AtomLegendProps) {
  // Deduplicate atoms by element
  const uniqueAtoms = molecule.atoms.reduce(
    (acc, atom) => {
      if (!acc.find((a) => a.element === atom.element)) {
        acc.push(atom);
      }
      return acc;
    },
    [] as typeof molecule.atoms
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-2xl border"
      style={{
        background: "rgba(5, 11, 24, 0.7)",
        borderColor: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      {uniqueAtoms.map((atom) => (
        <div key={atom.element} className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{
              background: atom.color,
              boxShadow: `0 0 8px ${atom.color}80`,
            }}
          />
          <span
            className="text-[10px] font-mono font-bold"
            style={{ color: atom.color }}
          >
            {atom.element}
          </span>
        </div>
      ))}
      {showLonePairs && molecule.lonePairPositions.length > 0 && (
        <div className="flex items-center gap-1.5 pl-2 border-l" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: "#ff44ff",
              boxShadow: "0 0 8px #ff44ff80",
            }}
          />
          <span className="text-[10px] font-mono font-bold text-fuchsia-400">LP</span>
        </div>
      )}
    </motion.div>
  );
}
