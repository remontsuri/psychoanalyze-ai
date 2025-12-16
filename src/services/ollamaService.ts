import { AnalysisResult } from "../types";

const OLLAMA_URL = 'http://localhost:11434';

export const analyzeWithOllama = async (text: string): Promise<AnalysisResult> => {
  try {
    const prompt = `Вы — эксперт-психолог. Проанализируйте стенограмму интервью.

ВАЖНО: Ответьте ТОЛЬКО валидным JSON в следующем формате:
{
  "summary": "Краткое резюме анализа",
  "language": "Определенный язык",
  "riskLevel": "Low|Medium|High",
  "defenseMechanisms": [{"name": "", "description": "", "frequency": "High|Medium|Low", "exampleQuote": ""}],
  "attachmentProfile": {"style": "Secure|Anxious|Avoidant|Disorganized", "confidence": 0-100, "indicators": []},
  "emotionalTriggers": [{"trigger": "", "response": "", "intensity": 1-10}],
  "themes": [{"title": "", "description": "", "relevanceScore": 0-100}],
  "sentimentTrend": [{"segment": 1-10, "score": -1 to 1, "label": "Positive|Negative|Neutral"}],
  "emotionTrend": [{"segment": 1-10, "happiness": 0-10, "sadness": 0-10, "anger": 0-10, "anxiety": 0-10}],
  "therapyRecommendations": [],
  "keyQuotes": [{"text": "", "category": "", "analysis": ""}],
  "academicNotes": "Научные заметки"
}

Используйте классификацию Вайланта для защитных механизмов и теорию привязанности Боулби.

СТЕНОГРАММА: ${text}`;

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:latest',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();
    const jsonText = data.response;
    
    // Try to extract JSON from response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Ollama response");
    }

    return JSON.parse(jsonMatch[0]) as AnalysisResult;
  } catch (error) {
    console.error("Ollama analysis failed:", error);
    throw error;
  }
};