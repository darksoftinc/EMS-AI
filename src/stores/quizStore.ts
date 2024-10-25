import { create } from 'zustand';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  grade: string;
  difficulty: string;
  questions: QuizQuestion[];
  assignedStudents: string[];
}

interface QuizState {
  quizzes: Quiz[];
  addQuiz: (quiz: Quiz) => void;
  removeQuiz: (id: string) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  assignStudents: (quizId: string, studentIds: string[]) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  quizzes: [],
  addQuiz: (quiz) => set((state) => ({
    quizzes: [...state.quizzes, quiz]
  })),
  removeQuiz: (id) => set((state) => ({
    quizzes: state.quizzes.filter(quiz => quiz.id !== id)
  })),
  updateQuiz: (id, updates) => set((state) => ({
    quizzes: state.quizzes.map(quiz =>
      quiz.id === id ? { ...quiz, ...updates } : quiz
    )
  })),
  assignStudents: (quizId, studentIds) => set((state) => ({
    quizzes: state.quizzes.map(quiz =>
      quiz.id === quizId ? { ...quiz, assignedStudents: studentIds } : quiz
    )
  }))
}));