import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, LineChart } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Müfredat Yönetimi',
      description: 'Müfredatları oluşturun, düzenleyin ve yönetin',
      icon: BookOpen,
      path: '/curriculum',
      color: 'bg-blue-500',
    },
    {
      title: 'Quiz Oluşturma',
      description: 'AI destekli quiz ve sınavlar oluşturun',
      icon: Brain,
      path: '/quiz',
      color: 'bg-green-500',
    },
    {
      title: 'İlerleme Takibi',
      description: 'Öğrenci performanslarını analiz edin',
      icon: LineChart,
      path: '/progress',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Hoş Geldiniz
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className={`inline-flex p-3 rounded-lg ${card.color}`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {card.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;