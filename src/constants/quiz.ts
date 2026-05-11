/**
 * Quiz configuration constants
 */

export const QUIZ_CONFIG = {
  questionsPerQuiz: 10,
  timePerQuestion: 30, // seconds
  passingScore: 70, // percentage
  showExplanation: true,
  randomizeQuestions: true,
  randomizeOptions: true,
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
} as const;

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  MATCHING: 'matching',
} as const;
