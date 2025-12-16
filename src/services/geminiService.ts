import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "../types";
import { analyzeWithOllama } from "./ollamaService";

const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
  console.warn("Google Gemini API key not configured. Using mock data for demonstration.");
}

const genAI = new GoogleGenerativeAI(apiKey || 'DUMMY_KEY_FOR_BUILD');

function generateMockAnalysis(text: string): AnalysisResult {
  const textLength = text.length;
  const hasNegativeWords = /грустн|печаль|тревог|страх|боль|плох|ужас|депресс/i.test(text);
  const hasPositiveWords = /счастлив|радост|хорош|отличн|замечательн|прекрасн/i.test(text);
  
  return {
    summary: `Анализ текста длиной ${textLength} символов. Выявлены ${hasNegativeWords ? 'признаки эмоционального напряжения' : 'относительно стабильные эмоциональные паттерны'}. ${hasPositiveWords ? 'Присутствуют позитивные эмоциональные маркеры.' : 'Требуется дополнительное внимание к эмоциональному состоянию.'} Для получения полного анализа необходимо настроить API ключ Google Gemini.`,
    language: "Russian",
    riskLevel: hasNegativeWords ? "High" : hasPositiveWords ? "Low" : "Medium",
    defenseMechanisms: [
      {
        name: hasNegativeWords ? "Отрицание" : "Рационализация",
        description: hasNegativeWords ? "Отказ признавать негативные эмоции или ситуации" : "Попытка объяснить поведение логическими причинами",
        frequency: hasNegativeWords ? "High" : "Medium",
        exampleQuote: text.length > 50 ? `"${text.substring(0, 50)}..."` : `"Пример из текста: ${text.substring(0, 30)}..."`
      }
    ],
    attachmentProfile: {
      style: hasNegativeWords ? "Тревожный" : "Надежный",
      confidence: hasNegativeWords ? 85 : 65,
      indicators: hasNegativeWords ? ["Эмоциональная нестабильность", "Потребность в поддержке"] : ["Относительная стабильность", "Адаптивные механизмы"]
    },
    emotionalTriggers: [
      {
        trigger: hasNegativeWords ? "Стрессовые ситуации" : "Неопределенность",
        response: hasNegativeWords ? "Повышенная тревожность" : "Адаптивная реакция",
        intensity: hasNegativeWords ? 8 : 5
      }
    ],
    themes: [
      {
        title: hasNegativeWords ? "Эмоциональные трудности" : "Общие жизненные темы",
        description: hasNegativeWords ? "Выявлены признаки эмоционального дистресса" : "Обычные жизненные вопросы и размышления",
        relevanceScore: hasNegativeWords ? 90 : 70
      }
    ],
    sentimentTrend: Array.from({length: 10}, (_, i) => ({
      segment: i + 1,
      score: hasNegativeWords ? (Math.random() - 0.7) : (Math.random() - 0.3),
      label: hasNegativeWords ? (i < 7 ? "Негативный" : "Нейтральный") : (i < 3 ? "Нейтральный" : "Позитивный")
    })),
    emotionTrend: Array.from({length: 10}, (_, i) => ({
      segment: i + 1,
      happiness: hasPositiveWords ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 4) + 2,
      sadness: hasNegativeWords ? Math.floor(Math.random() * 5) + 4 : Math.floor(Math.random() * 3) + 1,
      anger: hasNegativeWords ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 3) + 1,
      anxiety: hasNegativeWords ? Math.floor(Math.random() * 4) + 5 : Math.floor(Math.random() * 4) + 2
    })),
    therapyRecommendations: hasNegativeWords ? [
      "Когнитивно-поведенческая терапия для работы с негативными мыслями",
      "Техники релаксации и управления стрессом",
      "Поддерживающая психотерапия для эмоциональной стабилизации",
      "Работа с травматическим опытом при необходимости"
    ] : [
      "Поддерживающие беседы для укрепления позитивных паттернов",
      "Развитие навыков эмоциональной регуляции",
      "Работа над личностным ростом и самопознанием"
    ],
    keyQuotes: [
      {
        text: text.length > 100 ? `"${text.substring(0, 80)}..."` : `"${text}"`,
        category: hasNegativeWords ? "Эмоциональное напряжение" : "Общие паттерны",
        analysis: hasNegativeWords ? "Обнаружены маркеры эмоционального дистресса" : "Относительно стабильное эмоциональное состояние"
      }
    ],
    academicNotes: `## Демонстрационный анализ\n\n**Длина текста:** ${textLength} символов\n**Эмоциональные маркеры:** ${hasNegativeWords ? 'Негативные' : hasPositiveWords ? 'Позитивные' : 'Нейтральные'}\n\n${hasNegativeWords ? 'Выявлены признаки эмоционального напряжения, требующие внимания специалиста.' : 'Текст демонстрирует относительно стабильные эмоциональные паттерны.'}\n\n*Примечание: Это демонстрационный анализ. Для получения полноценного психологического анализа с использованием ИИ необходимо настроить API ключ Google Gemini.*`
  };
}

export const analyzeTranscript = async (text: string): Promise<AnalysisResult> => {
  // Try Ollama first
  try {
    return await analyzeWithOllama(text);
  } catch (ollamaError) {
    console.log("Ollama failed, trying Gemini:", ollamaError);
  }

  // Check if API key is properly configured
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey === 'DUMMY_KEY_FOR_BUILD') {
    console.info('Using demo mode - configure VITE_GEMINI_API_KEY for real AI analysis');
    return generateMockAnalysis(text);
  }
  
  try {
    const prompt = `
      Вы — эксперт-психолог и научный ассистент. Ваша задача — проанализировать предоставленную стенограмму интервью, используя психоаналитические и психодинамические подходы.
      
      ВАЖНО: Весь вывод должен быть строго на РУССКОМ ЯЗЫКЕ, независимо от языка оригинала текста.

      Инструкции:
      1. Определите язык стенограммы (но вывод делайте на русском).
      2. Определите уровень психологического риска (Низкий, Средний, Высокий) на основе признаков депрессии, агрессии или диссоциации.
      3. Определите защитные механизмы (по классификации Вайланта).
      4. Оцените тип привязанности (Боулби/Эйнсворт).
      5. Выявите эмоциональные триггеры и реакции.
      6. Выделите ключевые темы и паттерны.
      7. Проведите анализ тональности (Sentiment) по 10 сегментам.
      8. Проведите детальный анализ эмоций (Счастье, Грусть, Гнев, Тревога) по 10 сегментам (шкала 0-10).
      9. Дайте рекомендации по терапии (Therapy Recommendations) на основе выявленного профиля.
      10. Выберите ключевые цитаты.
      11. Создайте структурированные научные заметки (Markdown).

      Результат должен быть валидным JSON объектом.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const response = await model.generateContent(prompt + `\n\nTRANSCRIPT:\n\n${text}`);

    const jsonText = response.response.text();
    if (!jsonText) {
      throw new Error("No response from AI");
    }
    
    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    return generateMockAnalysis(text);
  }
};