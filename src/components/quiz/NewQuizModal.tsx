import React, { useState } from 'react';
import { generateQuizQuestions } from '../../config/gemini';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';

interface NewQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quiz: any) => void;
}

const gradeOptions = [
  { value: '1', label: '1. Sınıf' },
  { value: '2', label: '2. Sınıf' },
  { value: '3', label: '3. Sınıf' },
  { value: '4', label: '4. Sınıf' }
];

const difficultyOptions = [
  { value: 'easy', label: 'Kolay' },
  { value: 'medium', label: 'Orta' },
  { value: 'hard', label: 'Zor' }
];

function NewQuizModal({ isOpen, onClose, onSave }: NewQuizModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '1',
    difficulty: 'medium',
    questionCount: 5
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Quiz başlığı gereklidir');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiKey = localStorage.getItem('gemini_api_key');
      if (!apiKey) {
        throw new Error('Gemini API anahtarı bulunamadı. Lütfen önce API anahtarınızı ekleyin.');
      }

      // Prompt'u sınıf seviyesi ve zorluk derecesine göre özelleştir
      const prompt = `${formData.title} konusu için ${formData.questionCount} adet soru oluştur.
      Hedef Kitle: İlkokul ${formData.grade}. sınıf öğrencileri
      Zorluk Seviyesi: ${formData.difficulty === 'easy' ? 'Kolay' : formData.difficulty === 'medium' ? 'Orta' : 'Zor'}
      
      Önemli Notlar:
      - Sorular ${formData.grade}. sınıf müfredatına uygun olmalı
      - ${formData.difficulty === 'easy' ? 'Basit ve temel kavramları içermeli' : 
         formData.difficulty === 'medium' ? 'Orta seviye düşünme becerileri gerektirmeli' : 
         'Analitik düşünme ve problem çözme becerileri gerektirmeli'}
      - Açık ve anlaşılır bir dil kullanılmalı
      - Her soru için detaylı açıklama eklenmelidir`;

      const quizData = await generateQuizQuestions(prompt, formData.questionCount);
      
      if (!quizData?.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
        throw new Error('Quiz soruları oluşturulamadı. Lütfen tekrar deneyin.');
      }

      onSave({
        title: formData.title,
        description: formData.description || `${formData.grade}. Sınıf - ${formData.questionCount} soruluk ${formData.title} quizi`,
        grade: formData.grade,
        difficulty: formData.difficulty,
        questions: quizData.questions.map((q: any, index: number) => ({
          id: `${Date.now()}-${index}`,
          ...q
        }))
      });
      
      setFormData({ 
        title: '', 
        description: '', 
        grade: '1', 
        difficulty: 'medium', 
        questionCount: 5 
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quiz oluşturulurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Yeni Quiz Oluştur</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Başlığı
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Örn: Toplama İşlemi"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama (Opsiyonel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Quiz hakkında kısa bir açıklama"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sınıf Seviyesi
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full p-2 border rounded-md bg-white"
                required
              >
                {gradeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zorluk Seviyesi
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full p-2 border rounded-md bg-white"
                required
              >
                {difficultyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soru Sayısı
            </label>
            <input
              type="number"
              value={formData.questionCount}
              onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
              min="1"
              max="20"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              {isLoading ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewQuizModal;