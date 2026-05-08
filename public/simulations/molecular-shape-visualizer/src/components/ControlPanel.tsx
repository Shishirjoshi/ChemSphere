import { motion } from "framer-motion";

interface ControlPanelProps {
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
}

interface ToggleProps {
  label: string;
  icon: string;
  value: boolean;
  onChange: (v: boolean) => void;
  accentColor?: string;
}

function Toggle({ label, icon, value, onChange, accentColor = "#06b6d4" }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 transition-all duration-300 text-left"
      style={{
        background: value
          ? `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${value ? accentColor + "50" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <span className="text-base">{icon}</span>
      <span className="flex-1 text-xs font-medium" style={{ color: value ? "#fff" : "#94a3b8" }}>
        {label}
      </span>
      <div
        className="relative w-8 h-4 rounded-full transition-all duration-300"
        style={{ background: value ? accentColor : "rgba(255,255,255,0.1)" }}
      >
        <motion.div
          animate={{ x: value ? 16 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow"
        />
      </div>
    </button>
  );
}

export function ControlPanel({
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
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
        Display Options
      </p>
      <Toggle
        label="Show Lone Pairs"
        icon="🔮"
        value={showLonePairs}
        onChange={setShowLonePairs}
        accentColor="#d946ef"
      />
      <Toggle
        label="Atom Labels"
        icon="🏷️"
        value={showLabels}
        onChange={setShowLabels}
        accentColor="#06b6d4"
      />
      <Toggle
        label="Bond Angles"
        icon="📐"
        value={showBondAngles}
        onChange={setShowBondAngles}
        accentColor="#f59e0b"
      />
      <Toggle
        label="Auto Rotate"
        icon="🌀"
        value={animateRepulsion}
        onChange={setAnimateRepulsion}
        accentColor="#22c55e"
      />
      <div
        className="mt-1 pt-2 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <Toggle
          label="Compare Mode"
          icon="⚖️"
          value={compareMode}
          onChange={setCompareMode}
          accentColor="#a855f7"
        />
      </div>
    </div>
  );
}
