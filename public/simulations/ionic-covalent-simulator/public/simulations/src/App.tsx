import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type BondType = 1 | 2 | 3;
type Geometry = "linear" | "bent" | "trigonal planar" | "trigonal pyramidal" | "tetrahedral" | "T-shaped" | "seesaw" | "square planar" | "square pyramidal" | "octahedral";

interface Atom {
  symbol: string;
  x: number;
  y: number;
  lonePairs: number;
  formalCharge: number;
  octetSatisfied: boolean;
  valenceElectrons: number;
  id: string;
}

interface Bond {
  from: string;
  to: string;
  type: BondType;
}

interface MoleculeData {
  atoms: Atom[];
  bonds: Bond[];
  totalValenceElectrons: number;
  usedElectrons: number;
  geometry: Geometry;
  bondAngles: string;
  polarity: string;
  hybridization: string;
  steps: string[];
  name: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

// ─── Valence electrons per element ───────────────────────────────────────────
const VALENCE: Record<string, number> = {
  H: 1, He: 2,
  Li: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, Ne: 8,
  Na: 1, Mg: 2, Al: 3, Si: 4, P: 5, S: 6, Cl: 7, Ar: 8,
  K: 1, Ca: 2, Br: 7, I: 7, Xe: 8,
};

const ELEMENT_COLORS: Record<string, string> = {
  H: "#ffffff", C: "#90cdf4", N: "#7ee8a2", O: "#fc8181",
  F: "#f6e05e", Cl: "#68d391", S: "#fbd38d", P: "#f6ad55",
  Br: "#d6bcfa", I: "#9f7aea", default: "#a0aec0",
};

// ─── Molecule database ────────────────────────────────────────────────────────
const MOLECULE_DB: Record<string, MoleculeData> = {
  H2O: {
    name: "Water",
    totalValenceElectrons: 8,
    usedElectrons: 8,
    geometry: "bent",
    bondAngles: "104.5°",
    polarity: "Polar",
    hybridization: "sp³",
    steps: [
      "Count valence electrons: O(6) + 2×H(1) = 8 total electrons",
      "Oxygen is the central atom (most electronegative non-H)",
      "Place 2 single bonds: O—H and O—H (uses 4 electrons)",
      "Distribute remaining 4 electrons as 2 lone pairs on oxygen",
      "Check octets: O has 8 electrons ✓, each H has 2 electrons ✓",
      "Geometry: bent (2 bonds + 2 lone pairs on O → sp³ hybridized)",
    ],
    atoms: [
      { symbol: "O", x: 200, y: 150, lonePairs: 2, formalCharge: 0, octetSatisfied: true, valenceElectrons: 6, id: "O1" },
      { symbol: "H", x: 100, y: 240, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 1, id: "H1" },
      { symbol: "H", x: 300, y: 240, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 1, id: "H2" },
    ],
    bonds: [
      { from: "O1", to: "H1", type: 1 },
      { from: "O1", to: "H2", type: 1 },
    ],
  },
  CO2: {
    name: "Carbon Dioxide",
    totalValenceElectrons: 16,
    usedElectrons: 16,
    geometry: "linear",
    bondAngles: "180°",
    polarity: "Nonpolar",
    hybridization: "sp",
    steps: [
      "Count valence electrons: C(4) + 2×O(6) = 16 total electrons",
      "Carbon is central atom (less electronegative than O)",
      "Place single bonds: O—C—O (uses 4 electrons)",
      "Distribute remaining 12 electrons: 3 lone pairs on each O",
      "Carbon only has 4 electrons — octet not satisfied!",
      "Convert lone pairs to double bonds: O=C=O",
      "Each atom now has 8 electrons ✓ — octet rule satisfied",
      "Geometry: linear (2 double bonds, no lone pairs on C → sp)",
    ],
    atoms: [
      { symbol: "C", x: 200, y: 170, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 4, id: "C1" },
      { symbol: "O", x: 80, y: 170, lonePairs: 2, formalCharge: 0, octetSatisfied: true, valenceElectrons: 6, id: "O1" },
      { symbol: "O", x: 320, y: 170, lonePairs: 2, formalCharge: 0, octetSatisfied: true, valenceElectrons: 6, id: "O2" },
    ],
    bonds: [
      { from: "C1", to: "O1", type: 2 },
      { from: "C1", to: "O2", type: 2 },
    ],
  },
  NH3: {
    name: "Ammonia",
    totalValenceElectrons: 8,
    usedElectrons: 8,
    geometry: "trigonal pyramidal",
    bondAngles: "107°",
    polarity: "Polar",
    hybridization: "sp³",
    steps: [
      "Count valence electrons: N(5) + 3×H(1) = 8 total electrons",
      "Nitrogen is the central atom",
      "Place 3 single bonds: N—H, N—H, N—H (uses 6 electrons)",
      "Remaining 2 electrons form 1 lone pair on nitrogen",
      "Check: N has 8 electrons ✓, each H has 2 electrons ✓",
      "Geometry: trigonal pyramidal (3 bonds + 1 lone pair on N → sp³)",
    ],
    atoms: [
      { symbol: "N", x: 200, y: 140, lonePairs: 1, formalCharge: 0, octetSatisfied: true, valenceElectrons: 5, id: "N1" },
      { symbol: "H", x: 100, y: 240, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 1, id: "H1" },
      { symbol: "H", x: 200, y: 260, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 1, id: "H2" },
      { symbol: "H", x: 300, y: 240, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 1, id: "H3" },
    ],
    bonds: [
      { from: "N1", to: "H1", type: 1 },
      { from: "N1", to: "H2", type: 1 },
      { from: "N1", to: "H3", type: 1 },
    ],
  },
  CH4: {
    name: "Methane",
    totalValenceElectrons: 8,
    usedElectrons: 8,
    geometry: "tetrahedral",
    bondAngles: "109.5°",
    polarity: "Nonpolar",
    hybridization: "sp³",
    steps: [
      "Count valence electrons: C(4) + 4×H(1) = 8 total electrons",
      "Carbon is the central atom",
      "Place 4 single bonds: C—H, C—H, C—H, C—H (uses 8 electrons)",
      "No electrons remain — all used in bonds",
      "Check: C has 8 electrons ✓, each H has 2 electrons ✓",
      "Geometry: tetrahedral (4 bonds, 0 lone pairs on C → sp³)",
    ],
    atoms: [
      { symbol: "C", x: 200, y: 170, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 4, id: "C1" },
      { symbol: "H", x: 100, y: 100, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 1, id: "H1" },
      { symbol: "H", x: 300, y: 100, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 1, id: "H2" },
      { symbol: "H", x: 100, y: 250, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 1, id: "H3" },
      { symbol: "H", x: 300, y: 250, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 1, id: "H4" },
    ],
    bonds: [
      { from: "C1", to: "H1", type: 1 },
      { from: "C1", to: "H2", type: 1 },
      { from: "C1", to: "H3", type: 1 },
      { from: "C1", to: "H4", type: 1 },
    ],
  },
  SO2: {
    name: "Sulfur Dioxide",
    totalValenceElectrons: 18,
    usedElectrons: 18,
    geometry: "bent",
    bondAngles: "119°",
    polarity: "Polar",
    hybridization: "sp²",
    steps: [
      "Count valence electrons: S(6) + 2×O(6) = 18 total electrons",
      "Sulfur is the central atom (Period 3, can exceed octet)",
      "Place single bonds: O—S—O (uses 4 electrons)",
      "Distribute remaining 14 electrons: lone pairs on O and S",
      "S still needs more electrons — form one double bond",
      "S has expanded octet with one double bond + one lone pair",
      "Geometry: bent (2 bonds + 1 lone pair on S → sp²)",
    ],
    atoms: [
      { symbol: "S", x: 200, y: 150, lonePairs: 1, formalCharge: 0, octetSatisfied: true, valenceElectrons: 6, id: "S1" },
      { symbol: "O", x: 90, y: 240, lonePairs: 2, formalCharge: 0, octetSatisfied: true, valenceElectrons: 6, id: "O1" },
      { symbol: "O", x: 310, y: 240, lonePairs: 3, formalCharge: -1, octetSatisfied: true, valenceElectrons: 6, id: "O2" },
    ],
    bonds: [
      { from: "S1", to: "O1", type: 2 },
      { from: "S1", to: "O2", type: 1 },
    ],
  },
  N2: {
    name: "Nitrogen Gas",
    totalValenceElectrons: 10,
    usedElectrons: 10,
    geometry: "linear",
    bondAngles: "180°",
    polarity: "Nonpolar",
    hybridization: "sp",
    steps: [
      "Count valence electrons: 2×N(5) = 10 total electrons",
      "Diatomic molecule — both atoms are equivalent",
      "Place single bond: N—N (uses 2 electrons)",
      "Distribute remaining 8 electrons: 3 lone pairs each",
      "Each N only has 6 electrons — octet not satisfied!",
      "Form triple bond: N≡N (uses remaining electrons)",
      "Each N now has 8 electrons ✓ — very strong triple bond",
    ],
    atoms: [
      { symbol: "N", x: 130, y: 170, lonePairs: 1, formalCharge: 0, octetSatisfied: true, valenceElectrons: 5, id: "N1" },
      { symbol: "N", x: 270, y: 170, lonePairs: 1, formalCharge: 0, octetSatisfied: true, valenceElectrons: 5, id: "N2" },
    ],
    bonds: [{ from: "N1", to: "N2", type: 3 }],
  },
  O2: {
    name: "Oxygen Gas",
    totalValenceElectrons: 12,
    usedElectrons: 12,
    geometry: "linear",
    bondAngles: "180°",
    polarity: "Nonpolar",
    hybridization: "sp²",
    steps: [
      "Count valence electrons: 2×O(6) = 12 total electrons",
      "Diatomic molecule — both atoms are equivalent",
      "Place single bond: O—O (uses 2 electrons)",
      "Distribute remaining 10 electrons: each O needs 6 more",
      "Each O only has 6 electrons — not satisfied!",
      "Form double bond: O=O",
      "Each O now has 8 electrons ✓",
    ],
    atoms: [
      { symbol: "O", x: 130, y: 170, lonePairs: 2, formalCharge: 0, octetSatisfied: true, valenceElectrons: 6, id: "O1" },
      { symbol: "O", x: 270, y: 170, lonePairs: 2, formalCharge: 0, octetSatisfied: true, valenceElectrons: 6, id: "O2" },
    ],
    bonds: [{ from: "O1", to: "O2", type: 2 }],
  },
  HCl: {
    name: "Hydrogen Chloride",
    totalValenceElectrons: 8,
    usedElectrons: 8,
    geometry: "linear",
    bondAngles: "180°",
    polarity: "Polar",
    hybridization: "sp³",
    steps: [
      "Count valence electrons: H(1) + Cl(7) = 8 total electrons",
      "Diatomic molecule with H and Cl",
      "Place single bond: H—Cl (uses 2 electrons)",
      "Distribute remaining 6 electrons as 3 lone pairs on Cl",
      "H has 2 electrons ✓, Cl has 8 electrons ✓",
    ],
    atoms: [
      { symbol: "H", x: 110, y: 170, lonePairs: 0, formalCharge: 0, octetSatisfied: true, valenceElectrons: 1, id: "H1" },
      { symbol: "Cl", x: 290, y: 170, lonePairs: 3, formalCharge: 0, octetSatisfied: true, valenceElectrons: 7, id: "Cl1" },
    ],
    bonds: [{ from: "H1", to: "Cl1", type: 1 }],
  },
};

// ─── Quiz questions ───────────────────────────────────────────────────────────
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "How many lone pairs does the oxygen atom have in H₂O?",
    options: ["0", "1", "2", "3"],
    correct: 2,
    explanation: "Oxygen in H₂O has 6 valence electrons. Two are used in bonds with H atoms, leaving 4 electrons = 2 lone pairs.",
  },
  {
    question: "What type of bond exists between the two atoms in N₂?",
    options: ["Single bond", "Double bond", "Triple bond", "Ionic bond"],
    correct: 2,
    explanation: "N₂ has a triple bond (N≡N). Each nitrogen contributes 3 electrons to the bond, sharing 6 electrons total.",
  },
  {
    question: "What is the molecular geometry of CH₄?",
    options: ["Linear", "Trigonal planar", "Tetrahedral", "Bent"],
    correct: 2,
    explanation: "CH₄ has 4 bonding pairs and 0 lone pairs around carbon, resulting in tetrahedral geometry with 109.5° bond angles.",
  },
  {
    question: "How many total valence electrons does CO₂ have?",
    options: ["12", "14", "16", "18"],
    correct: 2,
    explanation: "CO₂: C contributes 4 and each O contributes 6 valence electrons. Total = 4 + 6 + 6 = 16 electrons.",
  },
  {
    question: "Which molecule has a trigonal pyramidal geometry?",
    options: ["CH₄", "CO₂", "H₂O", "NH₃"],
    correct: 3,
    explanation: "NH₃ has 3 bonding pairs and 1 lone pair on nitrogen, giving it trigonal pyramidal geometry.",
  },
  {
    question: "What does the octet rule state?",
    options: [
      "Atoms share exactly 8 bonds",
      "Atoms tend to have 8 valence electrons in their outer shell",
      "Molecules always have 8 atoms",
      "Elements in period 8 are stable",
    ],
    correct: 1,
    explanation: "The octet rule states that atoms tend to form bonds until they have 8 electrons in their valence shell, achieving a stable noble gas configuration.",
  },
  {
    question: "What is the hybridization of carbon in CO₂?",
    options: ["sp", "sp²", "sp³", "sp³d"],
    correct: 0,
    explanation: "Carbon in CO₂ forms 2 double bonds with no lone pairs. This gives sp hybridization and a linear geometry.",
  },
  {
    question: "How many bonding pairs are in SO₂?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    explanation: "SO₂ has one single bond and one double bond between sulfur and the two oxygen atoms — that's 2 bonding pairs (one σ + one σ+π).",
  },
];

// ─── SVG Lewis Structure Renderer ────────────────────────────────────────────
function LewisCanvas({
  molecule,
  step,
  darkMode,
  showOctet,
}: {
  molecule: MoleculeData;
  step: number;
  darkMode: boolean;
  showOctet: boolean;
}) {
  const totalSteps = molecule.steps.length;
  const progress = step / totalSteps;

  // Which bonds/atoms to show based on step
  const visibleAtoms = molecule.atoms;
  const visibleBonds = molecule.bonds.slice(0, Math.ceil(progress * molecule.bonds.length));
  const showLonePairs = step >= Math.ceil(totalSteps * 0.6);

  const getColor = (symbol: string) =>
    ELEMENT_COLORS[symbol] || ELEMENT_COLORS["default"];

  const getAtomPos = (id: string) =>
    molecule.atoms.find((a) => a.id === id)!;

  const renderBond = (bond: Bond, idx: number) => {
    const from = getAtomPos(bond.from);
    const to = getAtomPos(bond.to);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    const gap = 5;
    const strokeColor = darkMode ? "#94a3b8" : "#475569";

    if (bond.type === 1) {
      return (
        <motion.line
          key={idx}
          x1={from.x} y1={from.y} x2={to.x} y2={to.y}
          stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        />
      );
    }
    if (bond.type === 2) {
      return (
        <g key={idx}>
          <motion.line
            x1={from.x + px * gap} y1={from.y + py * gap}
            x2={to.x + px * gap} y2={to.y + py * gap}
            stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          />
          <motion.line
            x1={from.x - px * gap} y1={from.y - py * gap}
            x2={to.x - px * gap} y2={to.y - py * gap}
            stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }}
          />
        </g>
      );
    }
    if (bond.type === 3) {
      return (
        <g key={idx}>
          <motion.line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
          <motion.line
            x1={from.x + px * gap * 1.8} y1={from.y + py * gap * 1.8}
            x2={to.x + px * gap * 1.8} y2={to.y + py * gap * 1.8}
            stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }} />
          <motion.line
            x1={from.x - px * gap * 1.8} y1={from.y - py * gap * 1.8}
            x2={to.x - px * gap * 1.8} y2={to.y - py * gap * 1.8}
            stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
        </g>
      );
    }
    return null;
  };

  const renderLonePairs = (atom: Atom) => {
    if (!showLonePairs || atom.lonePairs === 0) return null;
    const r = 26;
    const dotPositions = [
      { angle: 270, offset: r + 18 },
      { angle: 90, offset: r + 18 },
      { angle: 0, offset: r + 18 },
      { angle: 180, offset: r + 18 },
    ];
    const pairs = [];
    for (let i = 0; i < atom.lonePairs; i++) {
      const { angle, offset } = dotPositions[i % dotPositions.length];
      const rad = (angle * Math.PI) / 180;
      const cx = atom.x + Math.cos(rad) * offset;
      const cy = atom.y + Math.sin(rad) * offset;
      const perpRad = rad + Math.PI / 2;
      const d = 5;
      pairs.push(
        <g key={i}>
          <motion.circle
            cx={cx + Math.cos(perpRad) * d} cy={cy + Math.sin(perpRad) * d}
            r={3.5} fill="#60a5fa"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </motion.circle>
          <motion.circle
            cx={cx - Math.cos(perpRad) * d} cy={cy - Math.sin(perpRad) * d}
            r={3.5} fill="#60a5fa"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 + 0.05 }}
          >
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </motion.circle>
        </g>
      );
    }
    return pairs;
  };

  const renderAtom = (atom: Atom, idx: number) => {
    const color = getColor(atom.symbol);
    const isOctetSatisfied = showOctet && atom.octetSatisfied;
    return (
      <g key={atom.id}>
        {isOctetSatisfied && (
          <motion.circle
            cx={atom.x} cy={atom.y} r={32}
            fill="none" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 3" opacity={0.7}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${atom.x}px ${atom.y}px` }}
          />
        )}
        <motion.circle
          cx={atom.x} cy={atom.y} r={24}
          fill={darkMode ? "#1e293b" : "#f8fafc"}
          stroke={color} strokeWidth={2.5}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: idx * 0.05 }}
        />
        <motion.text
          x={atom.x} y={atom.y + 1}
          textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize={atom.symbol.length > 1 ? "13" : "16"}
          fontWeight="bold" fontFamily="monospace"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: idx * 0.05 + 0.2 }}
        >
          {atom.symbol}
        </motion.text>
        {atom.formalCharge !== 0 && (
          <text
            x={atom.x + 20} y={atom.y - 20}
            fill={atom.formalCharge > 0 ? "#f87171" : "#60a5fa"}
            fontSize="12" fontWeight="bold"
          >
            {atom.formalCharge > 0 ? `+${atom.formalCharge}` : atom.formalCharge}
          </text>
        )}
        {renderLonePairs(atom)}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 400 340" className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {visibleBonds.map((b, i) => renderBond(b, i))}
      {visibleAtoms.map((a, i) => renderAtom(a, i))}
    </svg>
  );
}

// ─── Geometry 3D Preview (SVG-based VSEPR shapes) ────────────────────────────
function GeometryPreview({ geometry, darkMode }: { geometry: Geometry; darkMode: boolean }) {
  const stroke = darkMode ? "#94a3b8" : "#475569";
  const fill = darkMode ? "#1e293b" : "#f1f5f9";
  const accent = "#60a5fa";

  const shapes: Record<string, React.ReactElement> = {
    linear: (
      <g>
        <line x1="60" y1="100" x2="140" y2="100" stroke={stroke} strokeWidth="2.5" />
        <circle cx="60" cy="100" r="14" fill={fill} stroke="#fc8181" strokeWidth="2" />
        <circle cx="100" cy="100" r="16" fill={fill} stroke={accent} strokeWidth="2.5" />
        <circle cx="140" cy="100" r="14" fill={fill} stroke="#fc8181" strokeWidth="2" />
        <text x="100" y="130" textAnchor="middle" fill={stroke} fontSize="11">180°</text>
      </g>
    ),
    bent: (
      <g>
        <line x1="100" y1="95" x2="65" y2="135" stroke={stroke} strokeWidth="2.5" />
        <line x1="100" y1="95" x2="135" y2="135" stroke={stroke} strokeWidth="2.5" />
        <path d="M75,118 Q100,100 125,118" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="65" cy="135" r="13" fill={fill} stroke="#fc8181" strokeWidth="2" />
        <circle cx="135" cy="135" r="13" fill={fill} stroke="#fc8181" strokeWidth="2" />
        <circle cx="100" cy="95" r="16" fill={fill} stroke={accent} strokeWidth="2.5" />
        <text x="100" y="155" textAnchor="middle" fill={stroke} fontSize="10">~104–119°</text>
      </g>
    ),
    "trigonal planar": (
      <g>
        <line x1="100" y1="75" x2="60" y2="140" stroke={stroke} strokeWidth="2.5" />
        <line x1="100" y1="75" x2="140" y2="140" stroke={stroke} strokeWidth="2.5" />
        <line x1="100" y1="75" x2="100" y2="150" stroke={stroke} strokeWidth="2.5" />
        <circle cx="60" cy="140" r="13" fill={fill} stroke="#fc8181" strokeWidth="2" />
        <circle cx="140" cy="140" r="13" fill={fill} stroke="#fc8181" strokeWidth="2" />
        <circle cx="100" cy="150" r="13" fill={fill} stroke="#fc8181" strokeWidth="2" />
        <circle cx="100" cy="75" r="16" fill={fill} stroke={accent} strokeWidth="2.5" />
        <text x="100" y="168" textAnchor="middle" fill={stroke} fontSize="10">120°</text>
      </g>
    ),
    "trigonal pyramidal": (
      <g>
        <line x1="100" y1="80" x2="60" y2="140" stroke={stroke} strokeWidth="2.5" />
        <line x1="100" y1="80" x2="140" y2="140" stroke={stroke} strokeWidth="2.5" />
        <line x1="100" y1="80" x2="100" y2="148" stroke={stroke} strokeWidth="2.5" />
        <ellipse cx="100" cy="145" rx="42" ry="10" fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
        <circle cx="60" cy="140" r="13" fill={fill} stroke="#fc8181" strokeWidth="2" />
        <circle cx="140" cy="140" r="13" fill={fill} stroke="#fc8181" strokeWidth="2" />
        <circle cx="100" cy="148" r="13" fill={fill} stroke="#fc8181" strokeWidth="2" />
        <circle cx="100" cy="80" r="16" fill={fill} stroke={accent} strokeWidth="2.5" />
        <text x="100" y="165" textAnchor="middle" fill={stroke} fontSize="10">~107°</text>
      </g>
    ),
    tetrahedral: (
      <g>
        <line x1="100" y1="75" x2="65" y2="130" stroke={stroke} strokeWidth="2.5" />
        <line x1="100" y1="75" x2="135" y2="130" stroke={stroke} strokeWidth="2.5" />
        <line x1="100" y1="75" x2="100" y2="148" stroke={stroke} strokeWidth="2.5" />
        <line x1="100" y1="75" x2="100" y2="60" stroke={stroke} strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="65" cy="130" r="13" fill={fill} stroke="#7ee8a2" strokeWidth="2" />
        <circle cx="135" cy="130" r="13" fill={fill} stroke="#7ee8a2" strokeWidth="2" />
        <circle cx="100" cy="148" r="13" fill={fill} stroke="#7ee8a2" strokeWidth="2" />
        <circle cx="100" cy="55" r="13" fill={fill} stroke="#7ee8a2" strokeWidth="2" opacity="0.6" />
        <circle cx="100" cy="75" r="16" fill={fill} stroke={accent} strokeWidth="2.5" />
        <text x="100" y="168" textAnchor="middle" fill={stroke} fontSize="10">109.5°</text>
      </g>
    ),
  };

  const shape = shapes[geometry] || shapes["linear"];

  return (
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[180px]">
      {shape}
    </svg>
  );
}

// ─── Electron Counter Animation ───────────────────────────────────────────────
function ElectronCounter({ total }: { total: number; darkMode: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center p-3">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-blue-400"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05, type: "spring" }}
          style={{ boxShadow: "0 0 6px #60a5fa" }}
        />
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [inputFormula, setInputFormula] = useState("H2O");
  const [currentMolecule, setCurrentMolecule] = useState<MoleculeData | null>(MOLECULE_DB["H2O"]);
  const [currentKey, setCurrentKey] = useState("H2O");
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [_maxStep, setMaxStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOctet, setShowOctet] = useState(false);
  const [mode, setMode] = useState<"learn" | "quiz" | "practice">("learn");
  const [activeTab, setActiveTab] = useState<"structure" | "steps" | "geometry">("structure");
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [practiceInput, setPracticeInput] = useState("");
  const [practiceHint, setPracticeHint] = useState(0);
  const [practiceCorrect, setPracticeCorrect] = useState(false);
  const [_showElectronAnim, setShowElectronAnim] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const COMMON = ["H2O", "CO2", "NH3", "CH4", "SO2", "N2", "O2", "HCl"];

  const loadMolecule = useCallback((formula: string) => {
    const key = formula.trim();
    const mol = MOLECULE_DB[key];
    if (mol) {
      setCurrentMolecule(mol);
      setCurrentKey(key);
      setError("");
      setStep(0);
      setMaxStep(mol.steps.length);
      setShowOctet(false);
      setShowElectronAnim(false);
    } else {
      setError(`"${key}" not found. Try: ${Object.keys(MOLECULE_DB).join(", ")}`);
      setCurrentMolecule(null);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMolecule(inputFormula);
  };

  const animateSteps = () => {
    if (!currentMolecule) return;
    setIsAnimating(true);
    setStep(0);
    let s = 0;
    const total = currentMolecule.steps.length;
    const tick = () => {
      s++;
      setStep(s);
      if (s < total) {
        animRef.current = setTimeout(tick, 900);
      } else {
        setIsAnimating(false);
        setShowOctet(true);
        setShowElectronAnim(true);
      }
    };
    animRef.current = setTimeout(tick, 400);
  };

  useEffect(() => () => { if (animRef.current) clearTimeout(animRef.current); }, []);

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(idx);
    setQuizTotal((t) => t + 1);
    if (idx === QUIZ_QUESTIONS[quizIdx].correct) setQuizScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (quizIdx + 1 >= QUIZ_QUESTIONS.length) {
      setQuizFinished(true);
    } else {
      setQuizIdx((i) => i + 1);
      setQuizAnswered(null);
    }
  };

  const resetQuiz = () => {
    setQuizIdx(0);
    setQuizAnswered(null);
    setQuizScore(0);
    setQuizTotal(0);
    setQuizFinished(false);
  };

  const checkPractice = () => {
    if (!currentMolecule) return;
    if (
      practiceInput.trim().toLowerCase() === currentMolecule.geometry.toLowerCase()
    ) {
      setPracticeCorrect(true);
    } else {
      setPracticeHint((h) => h + 1);
    }
  };

  const bg = darkMode ? "bg-gray-950" : "bg-slate-50";
  const card = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const text = darkMode ? "text-gray-100" : "text-gray-900";
  const sub = darkMode ? "text-gray-400" : "text-gray-600";
  const inp = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500";

  return (
    <div className={`min-h-screen ${bg} ${text} font-sans transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${darkMode ? "border-gray-800 bg-gray-950/90" : "border-gray-200 bg-white/90"} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-lg">⚛</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Lewis Structure Generator</h1>
              <p className={`text-xs ${sub}`}>Interactive Chemistry Learning</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(["learn", "quiz", "practice"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  mode === m
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : darkMode
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {m === "learn" ? "📚 Learn" : m === "quiz" ? "🎯 Quiz" : "✏️ Practice"}
              </button>
            ))}
            <button
              onClick={() => setDarkMode((d) => !d)}
              className={`ml-2 p-2 rounded-lg transition-colors ${darkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ── QUIZ MODE ──────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {mode === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-2xl border ${card} p-6 shadow-xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">🎯 Quiz Mode</h2>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${sub}`}>{quizIdx + 1}/{QUIZ_QUESTIONS.length}</span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
                    Score: {quizScore}/{quizTotal}
                  </span>
                </div>
              </div>

              {quizFinished ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">{quizScore >= QUIZ_QUESTIONS.length * 0.7 ? "🏆" : "📖"}</div>
                  <h3 className="text-3xl font-bold mb-2">{quizScore}/{QUIZ_QUESTIONS.length}</h3>
                  <p className={`text-lg ${sub} mb-6`}>
                    {quizScore === QUIZ_QUESTIONS.length ? "Perfect! You're a Lewis Structure expert! 🌟" :
                     quizScore >= QUIZ_QUESTIONS.length * 0.7 ? "Great job! Keep practicing!" : "Keep studying — you'll get there!"}
                  </p>
                  <button onClick={resetQuiz} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
                    Try Again
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className={`rounded-xl p-5 mb-6 ${darkMode ? "bg-gray-800" : "bg-blue-50"}`}>
                    <p className="text-lg font-semibold leading-relaxed">
                      {QUIZ_QUESTIONS[quizIdx].question}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {QUIZ_QUESTIONS[quizIdx].options.map((opt, i) => {
                      let cls = `p-4 rounded-xl border-2 text-left transition-all font-medium cursor-pointer `;
                      if (quizAnswered === null) {
                        cls += darkMode
                          ? "border-gray-700 bg-gray-800 hover:border-blue-500 hover:bg-gray-700"
                          : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50";
                      } else if (i === QUIZ_QUESTIONS[quizIdx].correct) {
                        cls += "border-green-500 bg-green-500/20 text-green-400";
                      } else if (i === quizAnswered) {
                        cls += "border-red-500 bg-red-500/20 text-red-400";
                      } else {
                        cls += darkMode ? "border-gray-700 bg-gray-800 opacity-50" : "border-gray-200 bg-white opacity-50";
                      }
                      return (
                        <button key={i} className={cls} onClick={() => handleQuizAnswer(i)}>
                          <span className="mr-2 opacity-60">{["A", "B", "C", "D"][i]}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {quizAnswered !== null && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className={`rounded-xl p-4 mb-4 ${quizAnswered === QUIZ_QUESTIONS[quizIdx].correct ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}
                      >
                        <p className="font-semibold mb-1">
                          {quizAnswered === QUIZ_QUESTIONS[quizIdx].correct ? "✅ Correct!" : "❌ Not quite!"}
                        </p>
                        <p className={`text-sm ${sub}`}>{QUIZ_QUESTIONS[quizIdx].explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {quizAnswered !== null && (
                    <button onClick={nextQuestion} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
                      {quizIdx + 1 >= QUIZ_QUESTIONS.length ? "See Results" : "Next Question →"}
                    </button>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ── LEARN / PRACTICE MODE ────────────────────────────────────────── */}
          {(mode === "learn" || mode === "practice") && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Input & Common Molecules */}
              <div className={`rounded-2xl border ${card} p-5 shadow-xl`}>
                <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputFormula}
                      onChange={(e) => setInputFormula(e.target.value)}
                      placeholder="Enter formula (e.g. H2O, CO2, NH3)"
                      className={`w-full px-4 py-3 rounded-xl border ${inp} outline-none transition-colors text-lg font-mono`}
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-red-400 text-xs">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                  >
                    Generate
                  </button>
                </form>
                <div className="flex flex-wrap gap-2 mt-7">
                  <span className={`text-xs font-medium ${sub} self-center`}>Quick select:</span>
                  {COMMON.map((f) => (
                    <button
                      key={f}
                      onClick={() => { setInputFormula(f); loadMolecule(f); }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-all border ${
                        currentKey === f
                          ? "border-blue-500 bg-blue-500/20 text-blue-400"
                          : darkMode
                          ? "border-gray-700 bg-gray-800 text-gray-300 hover:border-blue-500/50"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              {currentMolecule && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Molecule Info */}
                  <div className="lg:col-span-1 space-y-4">
                    {/* Molecule title */}
                    <div className={`rounded-2xl border ${card} p-5 shadow-xl`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                          <span className="text-white font-bold font-mono">{currentKey}</span>
                        </div>
                        <div>
                          <h2 className="font-bold text-lg leading-none">{currentMolecule.name}</h2>
                          <p className={`text-xs ${sub} font-mono`}>{currentKey}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {[
                          { label: "Total e⁻", value: currentMolecule.totalValenceElectrons, icon: "⚡" },
                          { label: "Geometry", value: currentMolecule.geometry, icon: "📐" },
                          { label: "Bond Angles", value: currentMolecule.bondAngles, icon: "📏" },
                          { label: "Polarity", value: currentMolecule.polarity, icon: "🧲" },
                          { label: "Hybridization", value: currentMolecule.hybridization, icon: "🔬" },
                        ].map(({ label, value, icon }) => (
                          <div key={label} className={`flex items-center justify-between px-3 py-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                            <span className={`text-sm ${sub} flex items-center gap-1.5`}>
                              <span>{icon}</span>{label}
                            </span>
                            <span className="text-sm font-semibold capitalize">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Electron counter */}
                    <div className={`rounded-2xl border ${card} p-4 shadow-xl`}>
                      <h3 className={`text-sm font-semibold ${sub} mb-2 flex items-center gap-2`}>
                        <span>⚡</span> Valence Electrons
                      </h3>
                      <ElectronCounter total={currentMolecule.totalValenceElectrons} darkMode={darkMode} />
                      <p className={`text-xs text-center ${sub} mt-2`}>
                        {currentMolecule.totalValenceElectrons} electrons total
                      </p>
                    </div>

                    {/* Atoms breakdown */}
                    <div className={`rounded-2xl border ${card} p-4 shadow-xl`}>
                      <h3 className={`text-sm font-semibold ${sub} mb-3 flex items-center gap-2`}>
                        <span>🔵</span> Atom Breakdown
                      </h3>
                      <div className="space-y-2">
                        {currentMolecule.atoms.map((atom) => (
                          <div key={atom.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono"
                              style={{
                                background: darkMode ? "#1e293b" : "#f8fafc",
                                border: `2px solid ${ELEMENT_COLORS[atom.symbol] || "#94a3b8"}`,
                                color: ELEMENT_COLORS[atom.symbol] || "#94a3b8",
                              }}
                            >
                              {atom.symbol}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{VALENCE[atom.symbol] ?? "?"} valence e⁻</span>
                                {atom.formalCharge !== 0 && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${atom.formalCharge > 0 ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                                    FC: {atom.formalCharge > 0 ? "+" : ""}{atom.formalCharge}
                                  </span>
                                )}
                              </div>
                              <div className={`text-xs ${sub}`}>
                                {atom.lonePairs > 0 ? `${atom.lonePairs} lone pair${atom.lonePairs > 1 ? "s" : ""}` : "No lone pairs"}
                                {atom.octetSatisfied && (
                                  <span className="ml-2 text-green-400">✓ octet</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Main Panel */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Tabs */}
                    <div className={`rounded-2xl border ${card} shadow-xl overflow-hidden`}>
                      <div className={`flex border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
                        {(["structure", "steps", "geometry"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                              activeTab === tab
                                ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5"
                                : `${sub} hover:text-blue-400`
                            }`}
                          >
                            {tab === "structure" ? "🧪 Structure" : tab === "steps" ? "📋 Steps" : "🔮 Geometry"}
                          </button>
                        ))}
                      </div>

                      <div className="p-5">
                        <AnimatePresence mode="wait">
                          {activeTab === "structure" && (
                            <motion.div key="structure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              {/* Controls */}
                              <div className="flex items-center gap-3 mb-4 flex-wrap">
                                <button
                                  onClick={animateSteps}
                                  disabled={isAnimating}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                  {isAnimating ? (
                                    <><span className="animate-spin">⟳</span> Animating...</>
                                  ) : (
                                    <><span>▶</span> Animate Build</>
                                  )}
                                </button>
                                <button
                                  onClick={() => { setStep(currentMolecule.steps.length); setShowOctet(true); }}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${darkMode ? "border-gray-700 hover:border-gray-600 text-gray-300" : "border-gray-300 hover:border-gray-400 text-gray-700"}`}
                                >
                                  Show All
                                </button>
                                <button
                                  onClick={() => { setStep(0); setShowOctet(false); setShowElectronAnim(false); }}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${darkMode ? "border-gray-700 hover:border-gray-600 text-gray-300" : "border-gray-300 hover:border-gray-400 text-gray-700"}`}
                                >
                                  Reset
                                </button>
                                <label className="flex items-center gap-2 cursor-pointer ml-auto">
                                  <span className={`text-sm ${sub}`}>Octet Highlight</span>
                                  <div
                                    onClick={() => setShowOctet((o) => !o)}
                                    className={`w-10 h-6 rounded-full transition-colors relative ${showOctet ? "bg-green-500" : darkMode ? "bg-gray-700" : "bg-gray-300"}`}
                                  >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${showOctet ? "translate-x-5" : "translate-x-1"}`} />
                                  </div>
                                </label>
                              </div>

                              {/* Step slider */}
                              <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className={sub}>Step {step}/{currentMolecule.steps.length}</span>
                                  <span className={`text-xs ${step === currentMolecule.steps.length ? "text-green-400" : sub}`}>
                                    {step === currentMolecule.steps.length ? "✓ Complete" : "In progress"}
                                  </span>
                                </div>
                                <input
                                  type="range" min={0} max={currentMolecule.steps.length}
                                  value={step}
                                  onChange={(e) => setStep(Number(e.target.value))}
                                  className="w-full accent-blue-500"
                                />
                              </div>

                              {/* SVG Canvas */}
                              <div className={`rounded-xl ${darkMode ? "bg-gray-800/50" : "bg-gray-50"} border ${darkMode ? "border-gray-700" : "border-gray-200"} h-72 flex items-center justify-center relative overflow-hidden`}>
                                {/* Glowing background */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                  <div className="absolute inset-0 opacity-5"
                                    style={{ backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                                </div>
                                <LewisCanvas
                                  molecule={currentMolecule}
                                  step={step}
                                  darkMode={darkMode}
                                  showOctet={showOctet}
                                />
                              </div>

                              {/* Bond legend */}
                              <div className="flex gap-4 mt-3 flex-wrap justify-center">
                                {[
                                  { label: "Single bond", desc: "2 e⁻ shared", color: "#94a3b8" },
                                  { label: "Double bond", desc: "4 e⁻ shared", color: "#60a5fa" },
                                  { label: "Triple bond", desc: "6 e⁻ shared", color: "#818cf8" },
                                  { label: "Lone pair", desc: "Non-bonding", color: "#60a5fa" },
                                ].map(({ label, desc, color }) => (
                                  <div key={label} className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
                                    <span className={`text-xs ${sub}`}>
                                      <strong className={text}>{label}</strong> – {desc}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {activeTab === "steps" && (
                            <motion.div key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <span>📋</span> Step-by-Step Construction
                              </h3>
                              <div className="space-y-3">
                                {currentMolecule.steps.map((s, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`flex gap-3 p-4 rounded-xl border ${
                                      i < step
                                        ? darkMode ? "border-blue-500/30 bg-blue-500/10" : "border-blue-200 bg-blue-50"
                                        : darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
                                    }`}
                                  >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                      i < step ? "bg-blue-500 text-white" : darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"
                                    }`}>
                                      {i < step ? "✓" : i + 1}
                                    </div>
                                    <p className={`text-sm leading-relaxed ${i < step ? text : sub}`}>{s}</p>
                                  </motion.div>
                                ))}
                              </div>
                              <div className="mt-4 flex gap-2">
                                <button
                                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                                  disabled={step === 0}
                                  className="flex-1 py-2 rounded-lg border border-gray-600 disabled:opacity-30 text-sm hover:border-blue-500 transition-colors"
                                >
                                  ← Previous
                                </button>
                                <button
                                  onClick={() => setStep((s) => Math.min(currentMolecule.steps.length, s + 1))}
                                  disabled={step === currentMolecule.steps.length}
                                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors disabled:opacity-30"
                                >
                                  Next →
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {activeTab === "geometry" && (
                            <motion.div key="geometry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <span>🔮</span> Molecular Geometry – VSEPR Preview
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"} p-4 flex items-center justify-center`} style={{ minHeight: 200 }}>
                                  <GeometryPreview geometry={currentMolecule.geometry} darkMode={darkMode} />
                                </div>
                                <div className="space-y-3">
                                  {[
                                    { label: "Shape", value: currentMolecule.geometry, icon: "📐" },
                                    { label: "Bond Angles", value: currentMolecule.bondAngles, icon: "📏" },
                                    { label: "Polarity", value: currentMolecule.polarity, icon: "🧲" },
                                    { label: "Hybridization", value: currentMolecule.hybridization, icon: "🔬" },
                                  ].map(({ label, value, icon }) => (
                                    <div key={label} className={`px-4 py-3 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span>{icon}</span>
                                        <span className={`text-xs uppercase tracking-wide font-medium ${sub}`}>{label}</span>
                                      </div>
                                      <span className="font-bold capitalize text-lg">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* VSEPR theory note */}
                              <div className={`mt-4 p-4 rounded-xl ${darkMode ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50 border border-blue-200"}`}>
                                <p className="text-sm font-semibold text-blue-400 mb-1">💡 VSEPR Theory</p>
                                <p className={`text-sm ${sub}`}>
                                  Valence Shell Electron Pair Repulsion predicts geometry by minimizing repulsion between electron pairs around the central atom. Lone pairs exert greater repulsion than bonding pairs.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Practice Mode Panel */}
                    {mode === "practice" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border ${card} p-5 shadow-xl`}
                      >
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <span>✏️</span> Practice Challenge
                        </h3>
                        {practiceCorrect ? (
                          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-6">
                            <div className="text-5xl mb-3">🎉</div>
                            <p className="text-xl font-bold text-green-400">Correct!</p>
                            <p className={`${sub} mt-1`}>The geometry is <strong>{currentMolecule.geometry}</strong></p>
                            <button
                              onClick={() => { setPracticeCorrect(false); setPracticeHint(0); setPracticeInput(""); }}
                              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                            >
                              Try Another
                            </button>
                          </motion.div>
                        ) : (
                          <>
                            <p className={`${sub} mb-4`}>
                              What is the molecular geometry of <strong className={text}>{currentMolecule.name} ({currentKey})</strong>?
                            </p>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={practiceInput}
                                onChange={(e) => setPracticeInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && checkPractice()}
                                placeholder="e.g. tetrahedral, bent, linear..."
                                className={`flex-1 px-4 py-2.5 rounded-xl border ${inp} outline-none font-mono`}
                              />
                              <button
                                onClick={checkPractice}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                              >
                                Check
                              </button>
                            </div>
                            <AnimatePresence>
                              {practiceHint > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className={`mt-3 p-3 rounded-lg ${darkMode ? "bg-yellow-900/20 border border-yellow-700/30" : "bg-yellow-50 border border-yellow-200"}`}
                                >
                                  <p className="text-yellow-400 text-sm font-medium mb-1">💡 Hint {practiceHint}</p>
                                  <p className={`text-sm ${sub}`}>
                                    {practiceHint === 1 && `${currentKey} has ${currentMolecule.atoms.filter(a => a.id !== currentMolecule.atoms[0].id).length} bonds around the central atom.`}
                                    {practiceHint === 2 && `The central atom has ${currentMolecule.atoms[0].lonePairs} lone pair(s).`}
                                    {practiceHint >= 3 && `The geometry starts with "${currentMolecule.geometry.slice(0, 3)}..."`}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                      </motion.div>
                    )}

                    {/* Octet Rule Info */}
                    <div className={`rounded-2xl border ${card} p-5 shadow-xl`}>
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <span>⚗️</span> Octet Rule Status
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {currentMolecule.atoms.map((atom) => {
                          const bondsToAtom = currentMolecule.bonds.filter(
                            (b) => b.from === atom.id || b.to === atom.id
                          );
                          const bondElectrons = bondsToAtom.reduce((s, b) => s + b.type * 2, 0);
                          const totalEl = atom.lonePairs * 2 + bondElectrons;
                          const needed = atom.symbol === "H" ? 2 : 8;
                          return (
                            <div key={atom.id} className={`rounded-xl p-3 text-center border ${atom.octetSatisfied ? (darkMode ? "border-green-700/50 bg-green-900/20" : "border-green-200 bg-green-50") : (darkMode ? "border-red-700/50 bg-red-900/20" : "border-red-200 bg-red-50")}`}>
                              <div className="text-xl font-bold font-mono mb-1" style={{ color: ELEMENT_COLORS[atom.symbol] || "#94a3b8" }}>
                                {atom.symbol}
                              </div>
                              <div className={`text-xs font-medium ${atom.octetSatisfied ? "text-green-400" : "text-red-400"}`}>
                                {totalEl}/{needed} e⁻
                              </div>
                              <div className={`text-xs mt-0.5 ${atom.octetSatisfied ? "text-green-400" : "text-red-400"}`}>
                                {atom.octetSatisfied ? "✓ Satisfied" : "✗ Incomplete"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className={`text-center text-xs ${sub} py-4 border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <p>Lewis Structure Generator • Built for Chemistry Students • VSEPR Theory & Octet Rule</p>
          <p className="mt-1">Supports: H₂O · CO₂ · NH₃ · CH₄ · SO₂ · N₂ · O₂ · HCl</p>
        </div>
      </div>
    </div>
  );
}
