export type AtomColor = string;

export interface AtomData {
  element: string;
  position: [number, number, number];
  color: string;
  radius: number;
  isLonePair?: boolean;
}

export interface BondData {
  from: number;
  to: number;
  order?: number;
}

export interface MoleculeData {
  name: string;
  formula: string;
  geometry: string;
  electronGeometry: string;
  hybridization: string;
  bondAngle: string;
  polarity: string;
  shape: string;
  description: string;
  vsepPairs: { bonding: number; lonePairs: number };
  atoms: AtomData[];
  bonds: BondData[];
  lonePairPositions: [number, number, number][];
  color: string;
  accentColor: string;
}

export const MOLECULES: Record<string, MoleculeData> = {
  H2O: {
    name: "Water",
    formula: "H₂O",
    geometry: "Bent",
    electronGeometry: "Tetrahedral",
    hybridization: "sp³",
    bondAngle: "104.5°",
    polarity: "Polar",
    shape: "bent",
    description:
      "Water has 2 bonding pairs and 2 lone pairs. The lone pairs repel the bonding pairs more strongly, compressing the H-O-H angle from ideal 109.5° to 104.5°. This bent shape makes water a polar molecule — essential for life.",
    vsepPairs: { bonding: 2, lonePairs: 2 },
    atoms: [
      { element: "O", position: [0, 0, 0], color: "#ff4444", radius: 0.5 },
      { element: "H", position: [-1.0, -0.8, 0], color: "#ffffff", radius: 0.3 },
      { element: "H", position: [1.0, -0.8, 0], color: "#ffffff", radius: 0.3 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
    ],
    lonePairPositions: [
      [-0.5, 0.7, 0.5],
      [0.5, 0.7, 0.5],
    ],
    color: "#06b6d4",
    accentColor: "#0e7490",
  },

  NH3: {
    name: "Ammonia",
    formula: "NH₃",
    geometry: "Trigonal Pyramidal",
    electronGeometry: "Tetrahedral",
    hybridization: "sp³",
    bondAngle: "107°",
    polarity: "Polar",
    shape: "trigonalPyramidal",
    description:
      "Ammonia has 3 bonding pairs and 1 lone pair on nitrogen. The lone pair pushes the three N-H bonds downward into a pyramid shape. Bond angle is 107° — slightly compressed from ideal tetrahedral due to lone pair repulsion.",
    vsepPairs: { bonding: 3, lonePairs: 1 },
    atoms: [
      { element: "N", position: [0, 0.2, 0], color: "#4488ff", radius: 0.45 },
      { element: "H", position: [-1.0, -0.5, 0.6], color: "#ffffff", radius: 0.28 },
      { element: "H", position: [1.0, -0.5, 0.6], color: "#ffffff", radius: 0.28 },
      { element: "H", position: [0, -0.5, -1.1], color: "#ffffff", radius: 0.28 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
    ],
    lonePairPositions: [[0, 1.1, 0]],
    color: "#a855f7",
    accentColor: "#7c3aed",
  },

  CO2: {
    name: "Carbon Dioxide",
    formula: "CO₂",
    geometry: "Linear",
    electronGeometry: "Linear",
    hybridization: "sp",
    bondAngle: "180°",
    polarity: "Nonpolar",
    shape: "linear",
    description:
      "CO₂ has 2 double bonds and no lone pairs on carbon. The two electron groups repel each other to opposite sides, creating a perfectly linear shape with 180° bond angle. Despite polar bonds, the molecule is nonpolar due to symmetry.",
    vsepPairs: { bonding: 2, lonePairs: 0 },
    atoms: [
      { element: "O", position: [-1.4, 0, 0], color: "#ff4444", radius: 0.45 },
      { element: "C", position: [0, 0, 0], color: "#888888", radius: 0.4 },
      { element: "O", position: [1.4, 0, 0], color: "#ff4444", radius: 0.45 },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 1, to: 2, order: 2 },
    ],
    lonePairPositions: [],
    color: "#f59e0b",
    accentColor: "#d97706",
  },

  CH4: {
    name: "Methane",
    formula: "CH₄",
    geometry: "Tetrahedral",
    electronGeometry: "Tetrahedral",
    hybridization: "sp³",
    bondAngle: "109.5°",
    polarity: "Nonpolar",
    shape: "tetrahedral",
    description:
      "Methane has 4 identical bonding pairs and no lone pairs. The four bonds arrange at equal angles in 3D space for minimum repulsion — a perfect tetrahedron with 109.5° angles. Completely symmetric, making it nonpolar.",
    vsepPairs: { bonding: 4, lonePairs: 0 },
    atoms: [
      { element: "C", position: [0, 0, 0], color: "#888888", radius: 0.45 },
      { element: "H", position: [1.0, 1.0, 1.0], color: "#ffffff", radius: 0.28 },
      { element: "H", position: [-1.0, -1.0, 1.0], color: "#ffffff", radius: 0.28 },
      { element: "H", position: [-1.0, 1.0, -1.0], color: "#ffffff", radius: 0.28 },
      { element: "H", position: [1.0, -1.0, -1.0], color: "#ffffff", radius: 0.28 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
    ],
    lonePairPositions: [],
    color: "#10b981",
    accentColor: "#059669",
  },

  PCl5: {
    name: "Phosphorus Pentachloride",
    formula: "PCl₅",
    geometry: "Trigonal Bipyramidal",
    electronGeometry: "Trigonal Bipyramidal",
    hybridization: "sp³d",
    bondAngle: "90°/120°",
    polarity: "Nonpolar",
    shape: "trigonalBipyramidal",
    description:
      "PCl₅ has 5 bonding pairs and no lone pairs. The 3 equatorial bonds form a triangle (120° apart), while 2 axial bonds are perpendicular (90° to equatorial). Expanded octet — requires d-orbital participation in sp³d hybridization.",
    vsepPairs: { bonding: 5, lonePairs: 0 },
    atoms: [
      { element: "P", position: [0, 0, 0], color: "#ff9900", radius: 0.55 },
      { element: "Cl", position: [-1.4, 0, 0], color: "#44cc44", radius: 0.5 },
      { element: "Cl", position: [0.7, 0, -1.2], color: "#44cc44", radius: 0.5 },
      { element: "Cl", position: [0.7, 0, 1.2], color: "#44cc44", radius: 0.5 },
      { element: "Cl", position: [0, 1.6, 0], color: "#44cc44", radius: 0.5 },
      { element: "Cl", position: [0, -1.6, 0], color: "#44cc44", radius: 0.5 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
    ],
    lonePairPositions: [],
    color: "#ec4899",
    accentColor: "#db2777",
  },

  SF6: {
    name: "Sulfur Hexafluoride",
    formula: "SF₆",
    geometry: "Octahedral",
    electronGeometry: "Octahedral",
    hybridization: "sp³d²",
    bondAngle: "90°",
    polarity: "Nonpolar",
    shape: "octahedral",
    description:
      "SF₆ has 6 bonding pairs and no lone pairs arranged at 90° to each other. All six positions are equivalent in a perfect octahedron. Requires sp³d² hybridization with d-orbital involvement. Completely symmetric — nonpolar despite polar S-F bonds.",
    vsepPairs: { bonding: 6, lonePairs: 0 },
    atoms: [
      { element: "S", position: [0, 0, 0], color: "#ffff00", radius: 0.6 },
      { element: "F", position: [1.6, 0, 0], color: "#00ffaa", radius: 0.4 },
      { element: "F", position: [-1.6, 0, 0], color: "#00ffaa", radius: 0.4 },
      { element: "F", position: [0, 1.6, 0], color: "#00ffaa", radius: 0.4 },
      { element: "F", position: [0, -1.6, 0], color: "#00ffaa", radius: 0.4 },
      { element: "F", position: [0, 0, 1.6], color: "#00ffaa", radius: 0.4 },
      { element: "F", position: [0, 0, -1.6], color: "#00ffaa", radius: 0.4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
    ],
    lonePairPositions: [],
    color: "#f97316",
    accentColor: "#ea580c",
  },
};

export const MOLECULE_KEYS = Object.keys(MOLECULES) as (keyof typeof MOLECULES)[];
