import React, { useState } from 'react';
import { generateCurriculumContent } from '../../config/gemini';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface NewModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: any) => void;
}

interface Lesson {
  title: string;
  content: string;
}

function NewModuleModal({ isOpen, onClose, onSave }: NewModuleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lessons: [{ title: '', content: '' }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.lessons.some(lesson => !lesson.title || !lesson.content)) {
      setError('Tüm ders alanları doldurulmalıdır');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // AI ile içerik oluşturma opsiyonel
      if (formData.lessons.length === 1 && !formData.lessons[0].content) {
        const curriculum = await generateCurriculumContent(formData.title);
        onSave(curriculum);
      } else {
        onSave(formData);
      }
      
      onClose();
    } catch (err) {
      setError('Müfredat oluşturulurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const addLesson = () => {
    setFormData({
      ...formData,
      lessons: [...formData.lessons, { title: '', content: '' }]
    });
  };

  const removeLesson = (index: number) => {
    if (formData.lessons.length > 1) {
      setFormData({
        ...formData,
        lessons: formData.lessons.filter((_, i) => i !== index)
      });
    }
  };

  const updateLesson = (index: number, field: keyof Lesson, value: string) => {
    const newLessons = [...formData.lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    setFormData({ ...formData, lessons: newLessons });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Yeni Modül Oluştur</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modül Başlığı
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-md"
                rows={3}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Dersler</h3>
                <button
                  type="button"
                  onClick={addLesson}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ders Ekle
                </button>
              </div>

              {formData.lessons.map((lesson, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Ders {index + 1}</h4>
                    {formData.lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => updateLesson(index, 'title', e.target.value)}
                    placeholder="Ders başlığı"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                  
                  <textarea
                    value={lesson.content}
                    onChange={(e) => updateLesson(index, 'content', e.target.value)}
                    placeholder="Ders içeriği"
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

          <div className="flex justify-end space-x-2 mt-6">
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
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

export default NewModuleModal;