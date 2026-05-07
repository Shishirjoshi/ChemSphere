export interface Topic {
  id: string;
  title: string;
  category: 'Organic' | 'Inorganic' | 'Physical';
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nebImportance: 'High' | 'Medium' | 'Low';
  learningTime: string;
  formulas: string[];
  content?: string;
}

export interface ElementInfo {
  symbol: string;
  name: string;
  number: number;
  weight: number;
  category: string;
  color: string;
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  structure: {
    atoms: {
      type: string;
      position: [number, number, number];
    }[];
    bonds: {
      from: number;
      to: number;
      type: 'single' | 'double' | 'triple';
    }[];
  };
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
