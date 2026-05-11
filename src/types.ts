/**
 * Represents a chemistry topic in the learning platform
 * @interface Topic
 */
export interface Topic {
  /** Unique identifier for the topic */
  id: string;
  /** Display title of the topic */
  title: string;
  /** Category of chemistry */
  category: 'Organic' | 'Inorganic' | 'Physical';
  /** Detailed description of the topic */
  description: string;
  /** Difficulty level for learners */
  difficulty: 'Easy' | 'Medium' | 'Hard';
  /** Importance for National Education Board curriculum */
  nebImportance: 'High' | 'Medium' | 'Low';
  /** Estimated learning time */
  learningTime: string;
  /** Related chemical formulas */
  formulas: string[];
  /** Optional detailed content */
  content?: string;
}

/**
 * Represents an element from the periodic table
 * @interface ElementInfo
 */
export interface ElementInfo {
  /** Chemical symbol (e.g., 'H', 'O', 'C') */
  symbol: string;
  /** Full name of the element */
  name: string;
  /** Atomic number */
  number: number;
  /** Atomic weight */
  weight: number;
  /** Element category (e.g., 'Metal', 'Nonmetal') */
  category: string;
  /** Color representation for visualization */
  color: string;
}

/**
 * Represents a molecular structure with atoms and bonds
 * @interface Molecule
 */
export interface Molecule {
  /** Unique identifier for the molecule */
  id: string;
  /** Common name of the molecule */
  name: string;
  /** Chemical formula */
  formula: string;
  /** 3D structure definition */
  structure: {
    /** Array of atoms with their positions */
    atoms: {
      /** Element symbol */
      type: string;
      /** 3D coordinates [x, y, z] */
/**
 * Represents a single question in a quiz
 * @interface QuizQuestion
 */
export interface QuizQuestion {
  /** Unique identifier for the question */
  id: string;
  /** The question text */
  question: string;
  /** Multiple choice options */
  options: string[];
  /** Index of the correct option */
  correctAnswer: number;
  /** Explanation for the correct answer */ atom */
      from: number;
      /** Index of second atom */
      to: number;
      /** Type of chemical bond */
      type: 'single' | 'double' | 'triple';
    }[];
  };
  /** Description of the molecule */
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
