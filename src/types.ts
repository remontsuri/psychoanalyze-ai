export interface DefenseMechanism {
  name: string;
  description: string;
  frequency: 'High' | 'Medium' | 'Low';
  exampleQuote: string;
}

export interface Theme {
  title: string;
  description: string;
  relevanceScore: number; // 0-100
}

export interface SentimentPoint {
  segment: number;
  score: number; // -1 to 1
  label: string;
}

export interface EmotionPoint {
  segment: number;
  happiness: number; // 0-10
  sadness: number;   // 0-10
  anger: number;     // 0-10
  anxiety: number;   // 0-10
}

export interface EmotionalTrigger {
  trigger: string;
  response: string;
  intensity: number; // 1-10
}

export interface Quote {
  text: string;
  category: string;
  analysis: string;
}

export interface AttachmentProfile {
  style: string;
  confidence: number;
  indicators: string[];
}

export interface AnalysisResult {
  summary: string;
  language: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  defenseMechanisms: DefenseMechanism[];
  attachmentProfile: AttachmentProfile;
  emotionalTriggers: EmotionalTrigger[];
  themes: Theme[];
  sentimentTrend: SentimentPoint[];
  emotionTrend: EmotionPoint[];
  therapyRecommendations: string[];
  keyQuotes: Quote[];
  academicNotes: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  summary: string;
  data: AnalysisResult;
  userRating?: number; // 1-10
}

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';
