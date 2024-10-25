import { create } from 'zustand';

export interface Student {
  id: string;
  name: string;
  birthDate: string;
  school: string;
  grade: string;
  joinDate: string;
  progress: number;
  quizResults: QuizResult[];
}

interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  date: string;
}

interface StudentState {
  students: Student[];
  addStudent: (student: Omit<Student, 'quizResults'>) => void;
  removeStudent: (id: string) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  addQuizResult: (studentId: string, result: QuizResult) => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  addStudent: (student) => set((state) => ({
    students: [...state.students, { ...student, quizResults: [] }]
  })),
  removeStudent: (id) => set((state) => ({
    students: state.students.filter(student => student.id !== id)
  })),
  updateStudent: (id, updates) => set((state) => ({
    students: state.students.map(student =>
      student.id === id ? { ...student, ...updates } : student
    )
  })),
  addQuizResult: (studentId, result) => set((state) => ({
    students: state.students.map(student => {
      if (student.id === studentId) {
        const newResults = [...student.quizResults, result];
        const avgProgress = Math.round(
          newResults.reduce((sum, r) => sum + r.score, 0) / newResults.length
        );
        return {
          ...student,
          quizResults: newResults,
          progress: avgProgress
        };
      }
      return student;
    })
  }))
}));