import { motion } from "framer-motion";
import { MOLECULES } from "../data/molecules";

interface MoleculeSelectorProps {
  selected: string;
  onSelect: (key: string) => void;
  compareMode?: boolean;
  compareSelected?: string;
  onCompareSelect?: (key: string) => void;
}

export function MoleculeSelector({
  selected,
  onSelect,
  compareMode,
  compareSelected,
  onCompareSelect,
}: MoleculeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Object.entries(MOLECULES).map(([key, mol]) => {
        const isSelected = selected === key;
        const isCompareSelected = compareSelected === key;
        const isActive = isSelected || isCompareSelected;

        return (
          <div key={key} className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (compareMode && onCompareSelect && !isSelected) {
                  onCompareSelect(key);
                } else {
                  onSelect(key);
                }
              }}
              className="relative px-4 py-2 rounded-xl text-sm font-bold font-mono transition-all duration-300"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${mol.color}40, ${mol.accentColor}30)`
                  : isCompareSelected
                  ? `linear-gradient(135deg, ${mol.color}25, ${mol.accentColor}20)`
                  : "rgba(255,255,255,0.05)",
                border: isSelected
                  ? `1px solid ${mol.color}80`
                  : isCompareSelected
                  ? `1px solid ${mol.color}50`
                  : "1px solid rgba(255,255,255,0.1)",
                color: isActive ? mol.color : "#94a3b8",
                boxShadow: isSelected
                  ? `0 0 20px ${mol.color}30, inset 0 0 20px ${mol.color}10`
                  : "none",
              }}
            >
              {mol.formula}
              {isSelected && (
                <motion.div
                  layoutId="selector-glow"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `radial-gradient(circle, ${mol.color}15, transparent 70%)`,
                  }}
                />
              )}
              {isCompareSelected && compareMode && (
                <span
                  className="absolute -top-1.5 -right-1.5 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  style={{ background: mol.color, color: "#000" }}
                >
                  2
                </span>
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}
