import React, { useState } from 'react';
import { Loader2, BookOpen } from 'lucide-react';

interface NewLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: any) => void;
}

function NewLessonModal({ isOpen, onClose, onSave }: NewLessonModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    objectives: [''],
    activities: [''],
    duration: '45'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      content: formData.content,
      objectives: formData.objectives.filter(obj => obj.trim() !== ''),
      activities: formData.activities.filter(act => act.trim() !== ''),
      duration: formData.duration
    });
    setFormData({
      title: '',
      content: '',
      objectives: [''],
      activities: [''],
      duration: '45'
    });
    onClose();
  };

  const addObjective = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, '']
    });
  };

  const addActivity = () => {
    setFormData({
      ...formData,
      activities: [...formData.activities, '']
    });
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({
      ...formData,
      objectives: newObjectives
    });
  };

  const updateActivity = (index: number, value: string) => {
    const newActivities = [...formData.activities];
    newActivities[index] = value;
    setFormData({
      ...formData,
      activities: newActivities
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-center mb-6">Yeni Ders Ekle</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ders Başlığı
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
              Ders İçeriği
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Öğrenme Hedefleri
            </label>
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="Öğrenme hedefi..."
                />
                {index === formData.objectives.length - 1 && (
                  <button
                    type="button"
                    onClick={addObjective}
                    className="ml-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aktiviteler
            </label>
            {formData.activities.map((activity, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => updateActivity(index, e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="Aktivite..."
                />
                {index === formData.activities.length - 1 && (
                  <button
                    type="button"
                    onClick={addActivity}
                    className="ml-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Süre (Dakika)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full p-2 border rounded-md"
              min="1"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewLessonModal;