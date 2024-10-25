import React from 'react';
import { User, Search } from 'lucide-react';
import { useStudentStore } from '../../stores/studentStore';

interface StudentSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (studentId: string) => void;
  title: string;
}

function StudentSelectModal({ isOpen, onClose, onSelect, title }: StudentSelectModalProps) {
  const students = useStudentStore((state) => state.students);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
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
                  onClick={() => {
                    onSelect(student.id);
                    onClose();
                  }}
                  className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="ml-3 text-left">
                    <div className="text-sm font-medium">{student.name}</div>
                    <div className="text-xs text-gray-500">{student.email}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentSelectModal;