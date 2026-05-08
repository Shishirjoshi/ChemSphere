export interface AtomData {
  symbol: string;
  name: string;
  atomicNumber: number;
  group: number;
  period: number;
  valenceElectrons: number;
  electronegativity: number;
  color: string;
  glowColor: string;
  radius: number;
  category: 'nonmetal' | 'metal' | 'noble';
}

export const ATOMS: AtomData[] = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, group: 1, period: 1, valenceElectrons: 1, electronegativity: 2.20, color: '#60A5FA', glowColor: '#3B82F6', radius: 0.53, category: 'nonmetal' },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, group: 18, period: 1, valenceElectrons: 2, electronegativity: 0, color: '#FDE68A', glowColor: '#F59E0B', radius: 0.31, category: 'noble' },
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, group: 1, period: 2, valenceElectrons: 1, electronegativity: 0.98, color: '#F87171', glowColor: '#EF4444', radius: 1.67, category: 'metal' },
  { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, group: 2, period: 2, valenceElectrons: 2, electronegativity: 1.57, color: '#FB923C', glowColor: '#F97316', radius: 1.12, category: 'metal' },
  { symbol: 'B', name: 'Boron', atomicNumber: 5, group: 13, period: 2, valenceElectrons: 3, electronegativity: 2.04, color: '#A78BFA', glowColor: '#8B5CF6', radius: 0.87, category: 'nonmetal' },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, group: 14, period: 2, valenceElectrons: 4, electronegativity: 2.55, color: '#94A3B8', glowColor: '#64748B', radius: 0.77, category: 'nonmetal' },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, group: 15, period: 2, valenceElectrons: 5, electronegativity: 3.04, color: '#34D399', glowColor: '#10B981', radius: 0.75, category: 'nonmetal' },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, group: 16, period: 2, valenceElectrons: 6, electronegativity: 3.44, color: '#F472B6', glowColor: '#EC4899', radius: 0.73, category: 'nonmetal' },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, group: 17, period: 2, valenceElectrons: 7, electronegativity: 3.98, color: '#FCD34D', glowColor: '#FBBF24', radius: 0.71, category: 'nonmetal' },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, group: 18, period: 2, valenceElectrons: 8, electronegativity: 0, color: '#93C5FD', glowColor: '#60A5FA', radius: 0.51, category: 'noble' },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, group: 1, period: 3, valenceElectrons: 1, electronegativity: 0.93, color: '#FDBA74', glowColor: '#FB923C', radius: 1.90, category: 'metal' },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, group: 2, period: 3, valenceElectrons: 2, electronegativity: 1.31, color: '#6EE7B7', glowColor: '#34D399', radius: 1.60, category: 'metal' },
  { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, group: 13, period: 3, valenceElectrons: 3, electronegativity: 1.61, color: '#CBD5E1', glowColor: '#94A3B8', radius: 1.43, category: 'metal' },
  { symbol: 'Si', name: 'Silicon', atomicNumber: 14, group: 14, period: 3, valenceElectrons: 4, electronegativity: 1.90, color: '#C4B5FD', glowColor: '#A78BFA', radius: 1.17, category: 'nonmetal' },
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, group: 15, period: 3, valenceElectrons: 5, electronegativity: 2.19, color: '#FDE68A', glowColor: '#FCD34D', radius: 1.10, category: 'nonmetal' },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, group: 16, period: 3, valenceElectrons: 6, electronegativity: 2.58, color: '#FEF08A', glowColor: '#FACC15', radius: 1.04, category: 'nonmetal' },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, group: 17, period: 3, valenceElectrons: 7, electronegativity: 3.16, color: '#A3E635', glowColor: '#84CC16', radius: 0.99, category: 'nonmetal' },
  { symbol: 'K', name: 'Potassium', atomicNumber: 19, group: 1, period: 4, valenceElectrons: 1, electronegativity: 0.82, color: '#F9A8D4', glowColor: '#F472B6', radius: 2.43, category: 'metal' },
  { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, group: 2, period: 4, valenceElectrons: 2, electronegativity: 1.00, color: '#86EFAC', glowColor: '#4ADE80', radius: 1.97, category: 'metal' },
];

export interface MoleculePreset {
  id: string;
  name: string;
  formula: string;
  bondType: 'ionic' | 'covalent' | 'polar_covalent';
  atoms: string[];
  description: string;
  bondAngle?: number;
  geometry: string;
  lewisStructure: string;
  funFact: string;
  color: string;
}

export const MOLECULE_PRESETS: MoleculePreset[] = [
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H₂O',
    bondType: 'polar_covalent',
    atoms: ['H', 'O', 'H'],
    description: 'Polar covalent bonds with bent geometry',
    bondAngle: 104.5,
    geometry: 'Bent',
    lewisStructure: 'H-Ö-H',
    funFact: 'The bent shape of water makes it a polar molecule, essential for life!',
    color: '#60A5FA',
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    bondType: 'polar_covalent',
    atoms: ['O', 'C', 'O'],
    description: 'Linear molecule with double covalent bonds',
    bondAngle: 180,
    geometry: 'Linear',
    lewisStructure: 'O=C=O',
    funFact: 'CO₂ is a greenhouse gas that plants absorb during photosynthesis.',
    color: '#94A3B8',
  },
  {
    id: 'nh3',
    name: 'Ammonia',
    formula: 'NH₃',
    bondType: 'polar_covalent',
    atoms: ['H', 'N', 'H', 'H'],
    description: 'Trigonal pyramidal shape with lone pair',
    bondAngle: 107,
    geometry: 'Trigonal Pyramidal',
    lewisStructure: 'H-N̈-H (H below)',
    funFact: 'Ammonia is used in fertilizers and has a distinctive sharp smell.',
    color: '#34D399',
  },
  {
    id: 'ch4',
    name: 'Methane',
    formula: 'CH₄',
    bondType: 'covalent',
    atoms: ['H', 'C', 'H', 'H', 'H'],
    description: 'Perfect tetrahedral geometry',
    bondAngle: 109.5,
    geometry: 'Tetrahedral',
    lewisStructure: 'H-C(-H)(-H)-H',
    funFact: 'Methane is the simplest hydrocarbon and the main component of natural gas.',
    color: '#C4B5FD',
  },
  {
    id: 'nacl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    bondType: 'ionic',
    atoms: ['Na', 'Cl'],
    description: 'Ionic bond — complete electron transfer',
    bondAngle: undefined,
    geometry: 'Ionic Crystal',
    lewisStructure: 'Na⁺ [Cl]⁻',
    funFact: 'Table salt! Na gives its electron to Cl, forming Na⁺ and Cl⁻ ions.',
    color: '#FDBA74',
  },
];

export const getAtomBySymbol = (symbol: string): AtomData | undefined =>
  ATOMS.find((a) => a.symbol === symbol);
