/**
 * Atomic number and electron configuration utilities
 */

export interface AtomicData {
  atomicNumber: number;
  symbol: string;
  name: string;
  electronConfiguration: string;
  valenceElectrons: number;
  atomicRadius: number;
  ionizationEnergy: number;
}

/**
 * Calculate number of valence electrons based on group number
 * @param groupNumber - Group number in periodic table (1-18)
 * @returns Number of valence electrons
 */
export const getValenceElectrons = (groupNumber: number): number => {
  if (groupNumber <= 2) return groupNumber;
  if (groupNumber <= 12) return groupNumber - 10;
  if (groupNumber <= 18) return groupNumber - 10;
  return 0;
};

/**
 * Get electron configuration for an element
 * @param atomicNumber - Atomic number of the element
 * @returns Electron configuration string
 */
export const getElectronConfiguration = (atomicNumber: number): string => {
  const configs: Record<number, string> = {
    1: '1s¹',
    2: '1s²',
    6: '1s² 2s² 2p⁴',
    7: '1s² 2s² 2p⁵',
    8: '1s² 2s² 2p⁶',
    17: '[Ne] 3s² 3p⁵',
    18: '[Ne] 3s² 3p⁶',
  };
  return configs[atomicNumber] || '';
};

/**
 * Check if an element is a metal
 * @param atomicNumber - Atomic number
 * @returns True if element is a metal
 */
export const isMetal = (atomicNumber: number): boolean => {
  const nonmetals = [1, 6, 7, 8, 9, 15, 16, 17, 35, 53];
  return !nonmetals.includes(atomicNumber);
};

/**
 * Get electronegativity value (Pauling scale)
 * @param symbol - Element symbol
 * @returns Electronegativity value
 */
export const getElectronegativity = (symbol: string): number => {
  const values: Record<string, number> = {
    H: 2.20,
    C: 2.55,
    N: 3.04,
    O: 3.44,
    F: 3.98,
    S: 2.58,
    Cl: 3.16,
    Br: 2.96,
    I: 2.66,
  };
  return values[symbol] || 0;
};
