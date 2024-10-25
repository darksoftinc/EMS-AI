import React, { useState } from 'react';
import { Key, Loader2 } from 'lucide-react';
import { initializeGemini, getGeminiModel } from '../../config/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      initializeGemini(apiKey);
      // Test API anahtarını
      await getGeminiModel().generateContent('Test connection').response;
      onClose();
    } catch (err) {
      setError('Geçersiz API anahtarı veya bağlantı hatası');
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
            <Key className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-center mb-4">Gemini API Anahtarı</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          AI özelliklerini kullanmak için Google Gemini API anahtarınızı girin
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API Anahtarınızı girin"
            className="w-full p-2 border rounded-md mb-4"
            required
          />
          
          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}
          
          <div className="flex justify-end space-x-2">
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
              {isLoading ? 'Doğrulanıyor...' : 'Kaydet'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <p>API anahtarı almak için:</p>
          <ol className="list-decimal ml-4 mt-1">
            <li>Google AI Studio'ya gidin</li>
            <li>Yeni bir API anahtarı oluşturun</li>
            <li>Anahtarı buraya yapıştırın</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;