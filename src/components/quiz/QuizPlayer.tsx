import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Award } from 'lucide-react';
import { useStudentStore } from '../../stores/studentStore';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizPlayerProps {
  quiz: {
    id: string;
    title: string;
    questions: Question[];
  };
  studentId?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (result: { quizId: string; score: number }) => void;
}

function QuizPlayer({ quiz, studentId, isOpen, onClose, onComplete }: QuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const addQuizResult = useStudentStore((state) => state.addQuizResult);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index);
      const currentQ = quiz.questions[currentQuestion];
      const isCorrect = index === currentQ.correctAnswer;
      if (isCorrect) {
        setScore(score + 1);
      }
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
      const finalScore = Math.round((score / quiz.questions.length) * 100);
      
      if (studentId) {
        addQuizResult(studentId, {
          quizId: quiz.id,
          quizTitle: quiz.title,
          score: finalScore,
          date: new Date().toISOString().split('T')[0]
        });
      }

      if (onComplete) {
        onComplete({
          quizId: quiz.id,
          score: finalScore
        });
      }
    }
  };

  if (!isOpen) return null;

  const currentQ = quiz.questions[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  if (completed) {
    const finalScore = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-lg text-center">
          <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Quiz Tamamlandı!</h2>
          <div className="mb-6">
            <p className="text-lg mb-2">
              {quiz.questions.length} sorudan {score} doğru
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${finalScore}%` }}
              />
            </div>
            <p className="text-2xl font-bold text-blue-600">
              Başarı: {finalScore}%
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{quiz.title}</h2>
            <span className="text-sm text-gray-500">
              Soru {currentQuestion + 1}/{quiz.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedAnswer === null
                    ? 'hover:bg-gray-50 border-gray-200'
                    : selectedAnswer === index
                    ? isCorrect
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                    : index === currentQ.correctAnswer && showExplanation
                    ? 'bg-green-50 border-green-500'
                    : 'border-gray-200 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer === index && (
                    isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )
                  )}
                  {index === currentQ.correctAnswer && showExplanation && selectedAnswer !== index && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showExplanation && currentQ.explanation && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{currentQ.explanation}</p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Çık
          </button>
          {isAnswered && (
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {currentQuestion < quiz.questions.length - 1 ? (
                <>
                  Sonraki Soru
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                'Tamamla'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPlayer;