/**
 * API response type definitions for external services
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: number;
}

/**
 * Gemini API response for AI chat
 */
export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
      role: string;
    };
  }[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

/**
 * Firebase authentication response
 */
export interface AuthResponse {
  user: {
    uid: string;
    email: string;
    displayName: string | null;
  };
  token: string;
  expiresIn: number;
}

/**
 * Quiz submission response
 */
export interface QuizSubmissionResponse {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: {
    questionId: string;
    userAnswer: number;
    correct: boolean;
  }[];
}
