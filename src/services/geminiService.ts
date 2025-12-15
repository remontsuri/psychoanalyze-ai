import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "../types";

const apiKey = 'AIzaSyCGIu8UW3k-S5jpqZXTHtcp4h9erDLDuHI';



const genAI = new GoogleGenerativeAI(apiKey);

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

  
  try {
    const prompt = `You are an expert clinical psychologist. Analyze this psychological interview transcript.

Respond ONLY with valid JSON:
{
  "summary": "Clinical summary",
  "language": "Detected language",
  "riskLevel": "Low|Medium|High",
  "defenseMechanisms": [{"name": "", "description": "", "frequency": "High|Medium|Low", "exampleQuote": ""}],
  "attachmentProfile": {"style": "Secure|Anxious|Avoidant|Disorganized", "confidence": 0-100, "indicators": []},
  "emotionalTriggers": [{"trigger": "", "response": "", "intensity": 1-10}],
  "themes": [{"title": "", "description": "", "relevanceScore": 0-100}],
  "sentimentTrend": [{"segment": 1-10, "score": -1 to 1, "label": "Positive|Negative|Neutral"}],
  "emotionTrend": [{"segment": 1-10, "happiness": 0-10, "sadness": 0-10, "anger": 0-10, "anxiety": 0-10}],
  "therapyRecommendations": [],
  "keyQuotes": [{"text": "", "category": "", "analysis": ""}],
  "academicNotes": "Markdown notes"
}

Use Vaillant defense mechanisms, Bowlby attachment theory.`;

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