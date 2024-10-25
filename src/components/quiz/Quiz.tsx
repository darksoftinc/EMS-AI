import React, { useState } from 'react';
import { Brain, Plus, Edit2, Trash2, Play, Users } from 'lucide-react';
import NewQuizModal from './NewQuizModal';
import QuizPlayer from './QuizPlayer';
import ApiKeyModal from '../common/ApiKeyModal';
import AssignQuizModal from './AssignQuizModal';
import { useQuizStore } from '../../stores/quizStore';
import { useStudentStore } from '../../stores/studentStore';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
  assignedStudents?: string[];
  grade?: string;
}

function Quiz() {
  const { quizzes, addQuiz, removeQuiz, assignStudents } = useQuizStore();
  const students = useStudentStore((state) => state.students);
  const [showNewQuiz, setShowNewQuiz] = useState(false);
  const [showApiKey, setShowApiKey] = useState(!localStorage.getItem('gemini_api_key'));
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedQuizForAssign, setSelectedQuizForAssign] = useState<Quiz | null>(null);

  const handleNewQuiz = (quizData: any) => {
    const newQuiz = {
      id: Date.now().toString(),
      ...quizData,
      assignedStudents: [],
      questions: quizData.questions.map((q: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        ...q,
      })),
    };
    addQuiz(newQuiz);
  };

  const handleStartQuiz = (quiz: Quiz) => {
    if (quiz.assignedStudents && quiz.assignedStudents.length > 0) {
      setActiveQuiz(quiz);
      if (quiz.assignedStudents.length === 1) {
        setSelectedStudentId(quiz.assignedStudents[0]);
      }
    } else {
      alert('Lütfen önce quize öğrenci atayın');
    }
  };

  const handleDeleteQuiz = (quizId: string) => {
    removeQuiz(quizId);
  };

  const handleAssignStudents = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
      setSelectedQuizForAssign(quiz);
      setShowAssignModal(true);
    }
  };

  const handleAssignComplete = (studentIds: string[]) => {
    if (selectedQuizForAssign) {
      assignStudents(selectedQuizForAssign.id, studentIds);
      setSelectedQuizForAssign(null);
    }
    setShowAssignModal(false);
  };

  const handleQuizComplete = () => {
    setActiveQuiz(null);
    setSelectedStudentId(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Yönetimi</h1>
        <button
          onClick={() => setShowNewQuiz(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Quiz
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">{quiz.description}</p>
                  {quiz.grade && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                      {quiz.grade}. Sınıf
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="p-2 text-gray-400 hover:text-red-600"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-600">
                {quiz.questions.length} Soru
              </div>
              {quiz.assignedStudents && (
                <div className="text-sm text-gray-600">
                  {quiz.assignedStudents.length} Öğrenci Atandı
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleAssignStudents(quiz.id)}
                className="flex items-center px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Users className="h-4 w-4 mr-2" />
                Öğrenci Ata
              </button>
              <button 
                onClick={() => handleStartQuiz(quiz)}
                className="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="h-4 w-4 mr-2" />
                Başlat
              </button>
            </div>
          </div>
        ))}
      </div>

      <NewQuizModal
        isOpen={showNewQuiz}
        onClose={() => setShowNewQuiz(false)}
        onSave={handleNewQuiz}
      />

      <ApiKeyModal
        isOpen={showApiKey}
        onClose={() => setShowApiKey(false)}
      />

      {activeQuiz && (
        <QuizPlayer
          quiz={activeQuiz}
          studentId={selectedStudentId}
          isOpen={true}
          onClose={() => setActiveQuiz(null)}
          onComplete={handleQuizComplete}
        />
      )}

      {showAssignModal && selectedQuizForAssign && (
        <AssignQuizModal
          isOpen={true}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedQuizForAssign(null);
          }}
          onAssign={handleAssignComplete}
          students={students}
          assignedStudents={selectedQuizForAssign.assignedStudents}
        />
      )}
    </div>
  );
}

export default Quiz;