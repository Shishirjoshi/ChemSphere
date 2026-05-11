/**
 * Mock data utilities for testing and development
 */

import { Topic, QuizQuestion, Molecule, ElementInfo } from '../types';

export const createMockTopic = (overrides?: Partial<Topic>): Topic => ({
  id: 'mock-topic-1',
  title: 'Chemical Bonding',
  category: 'Inorganic',
  description: 'Understanding different types of chemical bonds',
  difficulty: 'Medium',
  nebImportance: 'High',
  learningTime: '45 minutes',
  formulas: ['NaCl', 'H2O', 'CO2'],
  ...overrides,
});

export const createMockQuestion = (overrides?: Partial<QuizQuestion>): QuizQuestion => ({
  id: 'mock-question-1',
  question: 'What is a covalent bond?',
  options: ['A bond between atoms sharing electrons', 'A bond between ions', 'A bond with a metal', 'All of the above'],
  correctAnswer: 0,
  explanation: 'A covalent bond is formed when two atoms share electrons.',
  ...overrides,
});

export const createMockMolecule = (overrides?: Partial<Molecule>): Molecule => ({
  id: 'mock-molecule-1',
  name: 'Water',
  formula: 'H2O',
  structure: {
    atoms: [
      { type: 'O', position: [0, 0, 0] },
      { type: 'H', position: [1, 0, 0] },
      { type: 'H', position: [-1, 0, 0] },
    ],
    bonds: [
      { from: 0, to: 1, type: 'single' },
      { from: 0, to: 2, type: 'single' },
    ],
  },
  description: 'Water molecule',
  ...overrides,
});

export const createMockElement = (overrides?: Partial<ElementInfo>): ElementInfo => ({
  symbol: 'C',
  name: 'Carbon',
  number: 6,
  weight: 12.01,
  category: 'Nonmetal',
  color: '#909090',
  ...overrides,
});
