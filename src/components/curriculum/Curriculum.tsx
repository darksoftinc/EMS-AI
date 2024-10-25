import React, { useState } from 'react';
import { Book, Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import NewModuleModal from './NewModuleModal';
import NewLessonModal from './NewLessonModal';
import ApiKeyModal from '../common/ApiKeyModal';

interface Lesson {
  id: string;
  title: string;
  content: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

function Curriculum() {
  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: 'Temel Matematik',
      description: 'Temel matematik kavramları ve işlemler',
      lessons: [
        { id: '1-1', title: 'Sayılar ve İşlemler', content: 'Doğal sayılar ve temel işlemler...' },
        { id: '1-2', title: 'Kesirler', content: 'Kesir kavramı ve kesirlerle işlemler...' },
      ],
    },
  ]);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showNewModule, setShowNewModule] = useState(false);
  const [showNewLesson, setShowNewLesson] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(!localStorage.getItem('gemini_api_key'));

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleNewModule = (moduleData: any) => {
    const newModule = {
      id: Date.now().toString(),
      title: moduleData.title,
      description: moduleData.description,
      lessons: moduleData.lessons.map((lesson: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        ...lesson,
      })),
    };
    setModules([...modules, newModule]);
  };

  const handleNewLesson = (lessonData: any) => {
    if (!selectedModuleId) return;

    const newLesson = {
      id: Date.now().toString(),
      ...lessonData,
    };

    setModules(modules.map(module => {
      if (module.id === selectedModuleId) {
        return {
          ...module,
          lessons: [...module.lessons, newLesson],
        };
      }
      return module;
    }));

    setShowNewLesson(false);
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
    const newExpanded = new Set(expandedModules);
    newExpanded.delete(moduleId);
    setExpandedModules(newExpanded);
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.filter(lesson => lesson.id !== lessonId),
        };
      }
      return module;
    }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Müfredat Yönetimi</h1>
        <button
          onClick={() => setShowNewModule(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Modül
        </button>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleModule(module.id)}
            >
              <div className="flex items-center space-x-3">
                <Book className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 text-gray-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteModule(module.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {expandedModules.has(module.id) ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedModules.has(module.id) && (
              <div className="border-t border-gray-100">
                <div className="p-4 space-y-2">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-sm text-gray-700">{lesson.title}</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteLesson(module.id, lesson.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 mt-2"
                    onClick={() => {
                      setSelectedModuleId(module.id);
                      setShowNewLesson(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Yeni Ders Ekle
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <NewModuleModal
        isOpen={showNewModule}
        onClose={() => setShowNewModule(false)}
        onSave={handleNewModule}
      />

      <NewLessonModal
        isOpen={showNewLesson}
        onClose={() => {
          setShowNewLesson(false);
          setSelectedModuleId(null);
        }}
        onSave={handleNewLesson}
      />

      <ApiKeyModal
        isOpen={showApiKey}
        onClose={() => setShowApiKey(false)}
      />
    </div>
  );
}

export default Curriculum;