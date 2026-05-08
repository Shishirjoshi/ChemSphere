import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SHAPES = [
  {
    name: "Linear",
    formula: "AB₂",
    angle: "180°",
    example: "CO₂",
    pairs: "2BP + 0LP",
    color: "#f59e0b",
    emoji: "➖",
    desc: "2 electron groups, no lone pairs. Perfectly straight.",
  },
  {
    name: "Bent",
    formula: "AB₂",
    angle: "~104°",
    example: "H₂O",
    pairs: "2BP + 2LP",
    color: "#06b6d4",
    emoji: "⌒",
    desc: "4 electron groups, 2 lone pairs compress the angle.",
  },
  {
    name: "Trig. Planar",
    formula: "AB₃",
    angle: "120°",
    example: "BF₃",
    pairs: "3BP + 0LP",
    color: "#22c55e",
    emoji: "△",
    desc: "3 electron groups in a flat triangle. All angles equal.",
  },
  {
    name: "Tetrahedral",
    formula: "AB₄",
    angle: "109.5°",
    example: "CH₄",
    pairs: "4BP + 0LP",
    color: "#10b981",
    emoji: "◈",
    desc: "4 electron groups, maximally spaced in 3D space.",
  },
  {
    name: "Trig. Bipyr.",
    formula: "AB₅",
    angle: "90°/120°",
    example: "PCl₅",
    pairs: "5BP + 0LP",
    color: "#ec4899",
    emoji: "⬡",
    desc: "5 groups. Equatorial (120°) and axial (90°) positions.",
  },
  {
    name: "Octahedral",
    formula: "AB₆",
    angle: "90°",
    example: "SF₆",
    pairs: "6BP + 0LP",
    color: "#f97316",
    emoji: "✦",
    desc: "6 electron groups at 90°. Perfect symmetric cage.",
  },
];

export function VSEPRGuide() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
        VSEPR Shape Guide
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {SHAPES.map((shape, i) => (
          <motion.button
            key={shape.name}
            onClick={() => setExpanded(expanded === i ? null : i)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl p-2.5 text-left border transition-all duration-200"
            style={{
              background:
                expanded === i
                  ? `linear-gradient(135deg, ${shape.color}20, ${shape.color}10)`
                  : "rgba(255,255,255,0.03)",
              borderColor: expanded === i ? `${shape.color}50` : "rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-base">{shape.emoji}</span>
              <span
                className="text-xs font-bold"
                style={{ color: expanded === i ? shape.color : "#e2e8f0" }}
              >
                {shape.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 font-mono">{shape.angle}</span>
              <span className="text-[10px] text-gray-600 font-mono">{shape.example}</span>
            </div>

            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-1.5"
                >
                  <p className="text-[10px] text-gray-400 leading-relaxed">{shape.desc}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                      style={{ background: `${shape.color}20`, color: shape.color }}
                    >
                      {shape.pairs}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
