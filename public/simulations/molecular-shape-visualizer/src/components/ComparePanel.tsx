import { motion } from "framer-motion";
import type { MoleculeData } from "../data/molecules";

interface ComparePanelProps {
  mol1: MoleculeData;
  mol2: MoleculeData;
}

const fields: { label: string; key: keyof MoleculeData }[] = [
  { label: "Formula", key: "formula" },
  { label: "Geometry", key: "geometry" },
  { label: "Electron Geometry", key: "electronGeometry" },
  { label: "Hybridization", key: "hybridization" },
  { label: "Bond Angle", key: "bondAngle" },
  { label: "Polarity", key: "polarity" },
];

export function ComparePanel({ mol1, mol2 }: ComparePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden border"
      style={{
        background: "rgba(10,15,30,0.8)",
        borderColor: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="grid grid-cols-3 text-center border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="p-3 border-r" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="font-mono font-bold text-base" style={{ color: mol1.color }}>
            {mol1.formula}
          </p>
          <p className="text-xs text-gray-400">{mol1.name}</p>
        </div>
        <div className="p-3 flex items-center justify-center">
          <span className="text-gray-500 text-sm font-bold">VS</span>
        </div>
        <div className="p-3 border-l" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="font-mono font-bold text-base" style={{ color: mol2.color }}>
            {mol2.formula}
          </p>
          <p className="text-xs text-gray-400">{mol2.name}</p>
        </div>
      </div>

      {/* Comparison Rows */}
      {fields.map((field, i) => {
        const v1 = String(mol1[field.key]);
        const v2 = String(mol2[field.key]);
        const same = v1 === v2;

        return (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-3 border-b last:border-0"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div
              className="p-2.5 text-center text-xs font-mono border-r"
              style={{
                color: mol1.color,
                borderColor: "rgba(255,255,255,0.06)",
                background: same ? `${mol1.color}08` : "transparent",
              }}
            >
              {v1}
            </div>
            <div className="p-2.5 text-center text-xs text-gray-500 font-medium flex items-center justify-center">
              {same ? (
                <span className="text-green-400 text-xs">✓ Same</span>
              ) : (
                <span className="text-gray-500">{field.label}</span>
              )}
            </div>
            <div
              className="p-2.5 text-center text-xs font-mono border-l"
              style={{
                color: mol2.color,
                borderColor: "rgba(255,255,255,0.06)",
                background: same ? `${mol2.color}08` : "transparent",
              }}
            >
              {v2}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
