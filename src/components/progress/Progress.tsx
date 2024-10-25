import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, TrendingUp, Award, UserPlus, CheckCircle2, XCircle, HelpCircle, School, GraduationCap, Calendar } from 'lucide-react';
import StudentList from '../students/StudentList';
import NewStudentModal from '../students/NewStudentModal';
import { useStudentStore } from '../../stores/studentStore';

function Progress() {
  const [showNewStudent, setShowNewStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Get students and actions from the store
  const students = useStudentStore((state) => state.students);
  const addStudent = useStudentStore((state) => state.addStudent);
  const removeStudent = useStudentStore((state) => state.removeStudent);

  const handleEditStudent = (studentId: string) => {
    setSelectedStudent(studentId);
  };

  const handleDeleteStudent = (id: string) => {
    removeStudent(id);
    if (selectedStudent === id) {
      setSelectedStudent(null);
    }
  };

  const handleAddStudent = (studentData: any) => {
    const newStudent = {
      ...studentData,
      progress: 0,
    };
    addStudent(newStudent);
  };

  const selectedStudentData = selectedStudent ? students.find(s => s.id === selectedStudent) : null;

  const getStudentStats = (student: typeof students[0]) => {
    const totalQuizzes = student.quizResults.length;
    const totalQuestions = student.quizResults.reduce((sum, result) => {
      const questionCount = Math.round((result.score / 100) * 5);
      return sum + 5;
    }, 0);
    
    const totalCorrect = student.quizResults.reduce((sum, result) => {
      const correctCount = Math.round((result.score / 100) * 5);
      return sum + correctCount;
    }, 0);
    
    const totalWrong = totalQuestions - totalCorrect;
    const averageScore = totalQuizzes > 0
      ? student.quizResults.reduce((sum, result) => sum + result.score, 0) / totalQuizzes
      : 0;
    const highestScore = Math.max(...student.quizResults.map(result => result.score), 0);
    
    return [
      {
        title: 'Quiz Sayısı',
        value: totalQuizzes,
        icon: Award,
        change: totalQuizzes > 0 ? '+1' : '0',
        changeType: totalQuizzes > 0 ? 'increase' : 'neutral',
      },
      {
        title: 'Ortalama Başarı',
        value: `${Math.round(averageScore)}%`,
        icon: TrendingUp,
        change: `${averageScore > 0 ? '+' : ''}${Math.round(averageScore)}%`,
        changeType: averageScore > 0 ? 'increase' : 'neutral',
      },
      {
        title: 'En Yüksek Skor',
        value: `${highestScore}%`,
        icon: Award,
        change: `${highestScore}%`,
        changeType: 'neutral',
      },
    ];
  };

  const getQuizStats = (student: typeof students[0]) => {
    const totalQuizzes = student.quizResults.length;
    const totalQuestions = student.quizResults.reduce((sum, result) => {
      const questionCount = Math.round((result.score / 100) * 5);
      return sum + 5;
    }, 0);
    
    const totalCorrect = student.quizResults.reduce((sum, result) => {
      const correctCount = Math.round((result.score / 100) * 5);
      return sum + correctCount;
    }, 0);
    
    const totalWrong = totalQuestions - totalCorrect;

    return [
      {
        title: 'Toplam Soru',
        value: totalQuestions,
        icon: HelpCircle,
        color: 'bg-blue-100 text-blue-600'
      },
      {
        title: 'Doğru Cevap',
        value: totalCorrect,
        icon: CheckCircle2,
        color: 'bg-green-100 text-green-600'
      },
      {
        title: 'Yanlış Cevap',
        value: totalWrong,
        icon: XCircle,
        color: 'bg-red-100 text-red-600'
      }
    ];
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">İlerleme Analizi</h1>
        <button 
          onClick={() => setShowNewStudent(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Yeni Öğrenci
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Panel - Öğrenci Listesi */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Öğrenci Listesi</h2>
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Henüz öğrenci eklenmemiş</p>
                <button
                  onClick={() => setShowNewStudent(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                >
                  Yeni öğrenci ekle
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      selectedStudent === student.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.grade}. Sınıf</div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{student.progress}%</div>
                      <div className="text-xs text-gray-500">İlerleme</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Panel - Performans Detayları */}
        <div className="lg:col-span-2">
          {selectedStudentData ? (
            <div className="space-y-6">
              {/* Öğrenci Detayları */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">{selectedStudentData.name}</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <School className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Okul</div>
                      <div className="text-sm text-gray-500">{selectedStudentData.school}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Sınıf</div>
                      <div className="text-sm text-gray-500">{selectedStudentData.grade}. Sınıf</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Doğum Tarihi</div>
                      <div className="text-sm text-gray-500">{selectedStudentData.birthDate}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* İstatistikler */}
              <div className="grid gap-6 md:grid-cols-3">
                {getStudentStats(selectedStudentData).map((stat) => (
                  <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <stat.icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`text-sm ${
                        stat.changeType === 'increase' ? 'text-green-600' : 
                        stat.changeType === 'decrease' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-600"> son 30 gün</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quiz İstatistikleri */}
              <div className="grid gap-6 md:grid-cols-3">
                {getQuizStats(selectedStudentData).map((stat) => (
                  <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedStudentData.quizResults.length > 0 ? (
                <>
                  {/* Quiz Performans Grafiği */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Quiz Performansı</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedStudentData.quizResults}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="quizTitle" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="score"
                            name="Skor"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quiz Dağılımı */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Quiz Skorları Dağılımı</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selectedStudentData.quizResults}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="quizTitle" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="score" name="Skor" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <Award className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Henüz quiz sonucu bulunmuyor</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
              <p className="text-gray-500">Detayları görüntülemek için bir öğrenci seçin</p>
            </div>
          )}
        </div>
      </div>

      <NewStudentModal
        isOpen={showNewStudent}
        onClose={() => setShowNewStudent(false)}
        onSave={handleAddStudent}
      />
    </div>
  );
}

export default Progress;