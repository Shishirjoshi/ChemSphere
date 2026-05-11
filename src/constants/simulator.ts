/**
 * Constants for simulator configurations
 */

export const SIMULATOR_CONFIG = {
  bondSimulator: {
    maxAtoms: 10,
    maxBonds: 15,
    animationDuration: 300,
    defaultScale: 1.5,
  },
  moleculeShapeVisualizer: {
    rotationSpeed: 0.01,
    zoomMin: 0.5,
    zoomMax: 5,
    defaultZoom: 2,
  },
  lewisStructure: {
    maxElectrons: 32,
    gridSize: 50,
    snapToGrid: true,
  },
} as const;

export const BOND_TYPES = {
  SINGLE: 'single',
  DOUBLE: 'double',
  TRIPLE: 'triple',
  COVALENT: 'covalent',
  IONIC: 'ionic',
  METALLIC: 'metallic',
} as const;

export const MOLECULAR_SHAPES = {
  LINEAR: 'linear',
  TRIGONAL_PLANAR: 'trigonal_planar',
  TETRAHEDRAL: 'tetrahedral',
  TRIGONAL_BIPYRAMIDAL: 'trigonal_bipyramidal',
  OCTAHEDRAL: 'octahedral',
} as const;
