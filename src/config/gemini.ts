import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
  localStorage.setItem('gemini_api_key', apiKey);
};

export const getGeminiModel = () => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error('Gemini API anahtarı bulunamadı');
  }
  if (!genAI) {
    initializeGemini(apiKey);
  }
  return genAI!.getGenerativeModel({ model: 'gemini-pro' });
};

const calculateMathResult = (question: string): number | null => {
  try {
    // Sayıları ve operatörü ayıkla
    const cleanQuestion = question.replace(/[^0-9+\-×÷*/\s]/g, '').trim();
    const parts = cleanQuestion.split(/[\s+\-×÷*/]/);
    const numbers = parts.map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    
    if (numbers.length !== 2) return null;
    
    const [num1, num2] = numbers;
    
    // Operatörü belirle
    let operator = '';
    if (cleanQuestion.includes('+')) operator = '+';
    else if (cleanQuestion.includes('-')) operator = '-';
    else if (cleanQuestion.includes('×') || cleanQuestion.includes('*')) operator = '*';
    else if (cleanQuestion.includes('÷') || cleanQuestion.includes('/')) operator = '/';
    else return null;

    // Sonucu hesapla
    let result: number;
    switch (operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': 
        if (num2 === 0) return null;
        result = num1 / num2; 
        break;
      default: return null;
    }

    // Sonuç tam sayı değilse veya çok büyükse null dön
    if (!Number.isInteger(result) || !Number.isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
};

const validateAndFixQuestions = (questions: any[]) => {
  return questions.map(q => {
    // Matematik sorusu mu kontrol et
    const isMathQuestion = /[0-9+\-×÷*/=]/.test(q.question);
    if (!isMathQuestion) return q;

    const result = calculateMathResult(q.question);
    if (result === null) return q;

    // Doğru cevabı string'e çevir
    const correctAnswer = result.toString();

    // Seçenekleri düzenle
    let options = [...q.options];
    const correctIndex = options.findIndex(opt => opt.trim() === correctAnswer);

    if (correctIndex === -1) {
      // Doğru cevap seçeneklerde yoksa ekle
      options[0] = correctAnswer;
      q.correctAnswer = 0;
    } else {
      q.correctAnswer = correctIndex;
    }

    // Seçenekleri benzersiz yap
    options = Array.from(new Set(options.map(opt => opt.trim())));

    // Eksik seçenekleri tamamla
    while (options.length < 4) {
      const newOption = (result + options.length).toString();
      if (!options.includes(newOption)) {
        options.push(newOption);
      }
    }

    // Açıklama ekle
    const operatorMap: { [key: string]: string } = {
      '+': 'artı',
      '-': 'eksi',
      '×': 'çarpı',
      '*': 'çarpı',
      '÷': 'bölü',
      '/': 'bölü'
    };

    const operator = Object.keys(operatorMap).find(op => q.question.includes(op));
    if (operator) {
      const [num1, num2] = q.question.split(operator).map(n => parseInt(n));
      q.explanation = `${num1} ${operatorMap[operator]} ${num2} işleminin sonucu ${result} eder.`;
    }

    return {
      ...q,
      options,
      correctAnswer: q.correctAnswer
    };
  });
};

const safeJSONParse = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON bulunamadı');
    
    const parsedData = JSON.parse(jsonMatch[0]);
    
    if (parsedData.questions) {
      parsedData.questions = validateAndFixQuestions(parsedData.questions);
    }
    
    return parsedData;
  } catch (error) {
    console.error('JSON parse hatası:', error);
    throw new Error('Geçersiz JSON yanıtı');
  }
};

export const generateQuizQuestions = async (prompt: string, count: number = 5) => {
  const model = getGeminiModel();
  const fullPrompt = `${prompt}

Lütfen soruları aşağıdaki JSON formatında yanıt ver. ÇOK ÖNEMLİ KURALLAR:

1. Her soru için TAM 4 seçenek olmalı
2. Doğru cevap HER ZAMAN options dizisinde bulunmalı
3. correctAnswer, doğru cevabın options dizisindeki TAM İNDEKS NUMARASI olmalı (0-3 arası)
4. Matematik işlemleri için örnek format:

{
  "questions": [
    {
      "question": "12 ÷ 3 = ?",
      "options": ["4", "3", "5", "6"],
      "correctAnswer": 0,
      "explanation": "12 bölü 3 işleminin sonucu 4 eder."
    },
    {
      "question": "8 × 2 = ?",
      "options": ["16", "14", "18", "12"],
      "correctAnswer": 0,
      "explanation": "8 çarpı 2 işleminin sonucu 16 eder."
    }
  ]
}

Önemli Notlar:
- Toplam ${count} soru oluştur
- Her soru için detaylı açıklama ekle
- Seçenekler karışık sırada olabilir ama correctAnswer değeri MUTLAKA doğru cevabın bulunduğu indeks olmalı
- Matematik işlemlerinde sonuç her zaman net ve kesin olmalıdır
- İşlem operatörleri: +, -, ×, ÷ (çarpma için * yerine × kullan)`;
  
  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  return safeJSONParse(response.text());
};

export const generateCurriculumContent = async (topic: string) => {
  const model = getGeminiModel();
  const prompt = `${topic} konusu için bir eğitim müfredatı oluştur. 
  
Lütfen aşağıdaki JSON formatında yanıt ver:

{
  "title": "Konu Başlığı",
  "description": "Konu açıklaması",
  "lessons": [
    {
      "title": "Ders başlığı",
      "content": "Ders içeriği",
      "objectives": ["Öğrenme hedefi 1", "Öğrenme hedefi 2"],
      "activities": ["Aktivite 1", "Aktivite 2"],
      "duration": "45 dakika"
    }
  ]
}

Önemli Notlar:
- Her ders için öğrenme hedefleri ekle
- Pratik aktiviteler ve örnekler içer
- İçerik ilkokul seviyesine uygun olmalı
- Dersler 45 dakikalık periyotlara bölünmeli
- Her dersin sonunda değerlendirme aktiviteleri olmalı`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return safeJSONParse(response.text());
};