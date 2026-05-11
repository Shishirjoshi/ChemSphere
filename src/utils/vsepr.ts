/**
 * VSEPR (Valence Shell Electron Pair Repulsion) theory utilities
 * Helps determine molecular geometry and shapes
 */

export interface VSEPRShape {
  name: string;
  description: string;
  bondingPairs: number;
  lonePairs: number;
  angle: number;
  geometry: string;
}

/**
 * VSEPR shapes reference table
 */
export const VSEPR_SHAPES: Record<string, VSEPRShape> = {
  LINEAR: {
    name: 'Linear',
    description: 'Two atoms arranged in a line',
    bondingPairs: 2,
    lonePairs: 0,
    angle: 180,
    geometry: 'linear',
  },
  TRIGONAL_PLANAR: {
    name: 'Trigonal Planar',
    description: 'Three atoms in a plane around central atom',
    bondingPairs: 3,
    lonePairs: 0,
    angle: 120,
    geometry: 'trigonal_planar',
  },
  TETRAHEDRAL: {
    name: 'Tetrahedral',
    description: 'Four atoms in a tetrahedral arrangement',
    bondingPairs: 4,
    lonePairs: 0,
    angle: 109.5,
    geometry: 'tetrahedral',
  },
  TRIGONAL_BIPYRAMIDAL: {
    name: 'Trigonal Bipyramidal',
    description: 'Five atoms in a trigonal bipyramidal arrangement',
    bondingPairs: 5,
    lonePairs: 0,
    angle: 120,
    geometry: 'trigonal_bipyramidal',
  },
  OCTAHEDRAL: {
    name: 'Octahedral',
    description: 'Six atoms in an octahedral arrangement',
    bondingPairs: 6,
    lonePairs: 0,
    angle: 90,
    geometry: 'octahedral',
  },
};

/**
 * Determine molecular shape based on bonding and lone pairs
 * @param bondingPairs - Number of bonding electron pairs
 * @param lonePairs - Number of lone electron pairs
 * @returns The molecular shape
 */
export const determineMolecularShape = (bondingPairs: number, lonePairs: number): VSEPRShape | null => {
  const total = bondingPairs + lonePairs;

  if (total === 2) return VSEPR_SHAPES.LINEAR;
  if (total === 3 && lonePairs === 0) return VSEPR_SHAPES.TRIGONAL_PLANAR;
  if (total === 4 && lonePairs === 0) return VSEPR_SHAPES.TETRAHEDRAL;
  if (total === 5 && lonePairs === 0) return VSEPR_SHAPES.TRIGONAL_BIPYRAMIDAL;
  if (total === 6 && lonePairs === 0) return VSEPR_SHAPES.OCTAHEDRAL;

  return null;
};

/**
 * Get bond angle for a given electron pair geometry
 * @param totalPairs - Total electron pairs (bonding + lone)
 * @returns The expected bond angle in degrees
 */
export const getBondAngle = (totalPairs: number): number => {
  const angleMap: Record<number, number> = {
    2: 180,
    3: 120,
    4: 109.5,
    5: 120,
    6: 90,
  };
  return angleMap[totalPairs] || 0;
};
