import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

export const analyzeTranscript = async (text: string): Promise<AnalysisResult> => {
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

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'user', parts: [{ text: `TRANSCRIPT:\n\n${text}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Резюме психологического профиля." },
            language: { type: Type.STRING, description: "Язык оригинала (например, 'Russian', 'English')." },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Уровень риска для клиента." },
            defenseMechanisms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  frequency: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  exampleQuote: { type: Type.STRING }
                }
              }
            },
            attachmentProfile: {
              type: Type.OBJECT,
              properties: {
                style: { type: Type.STRING, description: "Например: Надежный, Тревожный, Избегающий." },
                confidence: { type: Type.NUMBER, description: "0 to 100" },
                indicators: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            emotionalTriggers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trigger: { type: Type.STRING },
                  response: { type: Type.STRING },
                  intensity: { type: Type.NUMBER, description: "1-10 scale" }
                }
              }
            },
            themes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  relevanceScore: { type: Type.NUMBER }
                }
              }
            },
            sentimentTrend: {
              type: Type.ARRAY,
              description: "10 сегментов интервью.",
              items: {
                type: Type.OBJECT,
                properties: {
                  segment: { type: Type.INTEGER },
                  score: { type: Type.NUMBER, description: "-1.0 (Негатив) to 1.0 (Позитив)" },
                  label: { type: Type.STRING }
                }
              }
            },
            emotionTrend: {
              type: Type.ARRAY,
              description: "Детальный анализ эмоций по 10 сегментам.",
              items: {
                type: Type.OBJECT,
                properties: {
                  segment: { type: Type.INTEGER },
                  happiness: { type: Type.NUMBER, description: "0-10" },
                  sadness: { type: Type.NUMBER, description: "0-10" },
                  anger: { type: Type.NUMBER, description: "0-10" },
                  anxiety: { type: Type.NUMBER, description: "0-10" }
                }
              }
            },
            therapyRecommendations: {
              type: Type.ARRAY,
              description: "Список рекомендаций для терапевтического вмешательства.",
              items: { type: Type.STRING }
            },
            keyQuotes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  category: { type: Type.STRING },
                  analysis: { type: Type.STRING }
                }
              }
            },
            academicNotes: { type: Type.STRING, description: "Научные заметки в формате Markdown." }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from AI");
    }
    
    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
