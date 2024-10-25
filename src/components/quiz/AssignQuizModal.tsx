import React, { useState } from 'react';
import { User, Search, Check } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface AssignQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (studentIds: string[]) => void;
  students: Student[];
  assignedStudents?: string[];
}

function AssignQuizModal({ isOpen, onClose, onAssign, students, assignedStudents = [] }: AssignQuizModalProps) {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set(assignedStudents));
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(Array.from(selectedStudents));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Öğrencilere Quiz Ata</h2>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Öğrenci ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="max-h-64 overflow-y-auto mb-4">
          {filteredStudents.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Öğrenci bulunamadı</p>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                    selectedStudents.has(student.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="ml-3 text-left">
                      <div className="text-sm font-medium">{student.name}</div>
                      <div className="text-xs text-gray-500">{student.email}</div>
                    </div>
                  </div>
                  {selectedStudents.has(student.id) && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignQuizModal;