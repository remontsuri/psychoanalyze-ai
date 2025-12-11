import { GoogleGenerativeAI } from '@google/generative-ai';

interface AnalysisResult {
  summary: string;
  sentiment: string;
  emotions: string[];
  personalityTraits: string[];
  psychologicalIndicators: string[];
  communicationStyle: string[];
  recommendations: string[];
}

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

export const analyzeTranscript = async (transcript: string): Promise<AnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `Analyze the following psychological interview transcript from a clinical perspective:

"${transcript}"

Provide a detailed JSON response with the following structure:
{
  "summary": "Brief summary of the interview",
  "sentiment": "Overall emotional sentiment",
  "emotions": ["list of identified emotions"],
  "personalityTraits": ["identified traits"],
  "psychologicalIndicators": ["indicators or concerns"],
  "communicationStyle": ["communication patterns"],
  "recommendations": ["suggestions for follow-up"]
}`
        }]
      }],
      generationConfig: {
        responseSchema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            sentiment: { type: 'string' },
            emotions: { type: 'array', items: { type: 'string' } },
            personalityTraits: { type: 'array', items: { type: 'string' } },
            psychologicalIndicators: { type: 'array', items: { type: 'string' } },
            communicationStyle: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } }
          },
          required: ['summary', 'sentiment', 'emotions', 'personalityTraits', 'psychologicalIndicators', 'communicationStyle', 'recommendations']
        }
      }
    });

    const text = response.response.text();
    
    if (!text) {
      throw new Error('No response received from Gemini API');
    }

    const data = JSON.parse(text) as AnalysisResult;
    return data;
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    throw new Error(`Failed to analyze transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
