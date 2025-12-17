import { useState, useEffect, useCallback, useMemo } from 'react';
import InputSection from './components/InputSection';
import Dashboard from './components/Dashboard';
import ComparisonView from './components/ComparisonView';
import { AnalysisResult, AnalysisStatus, HistoryItem } from './types';
import { analyzeTranscript } from './services/geminiService';
import { BrainCircuit, AlertCircle, PlusCircle, Moon, Sun } from 'lucide-react';

const STORAGE_KEYS = {
  THEME: 'theme',
  HISTORY: 'psychoanalyze_history'
} as const;

const MAX_HISTORY_ITEMS = 20;
const COMPARE_LIMIT = 2;

export default function App() {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [compareList, setCompareList] = useState<HistoryItem[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setTheme(isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Load history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) setHistory(JSON.parse(saved));
    } catch (error) {
      console.error('Failed to parse history:', error);
    }
  }, []);

  // Progress animation
  useEffect(() => {
    if (status !== 'loading') {
      setProgress(status === 'success' ? 100 : 0);
      return;
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => prev >= 90 ? prev : prev + Math.max(0.5, (90 - prev) / 20));
    }, 300);

    return () => clearInterval(interval);
  }, [status]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  }, [theme]);

  const saveToHistory = useCallback((result: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      summary: result.summary.substring(0, 100) + '...',
      data: result,
      userRating: 0
    };
    
    const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  }, [history]);

  const handleAnalyze = useCallback(async (text: string) => {
    // Validate input before processing
    if (!text || text.trim().length === 0) {
      setError('Текст для анализа не может быть пустым');
      setStatus('error');
      return;
    }

    if (text.trim().length < 50) {
      setError('Текст слишком короткий для анализа. Минимум 50 символов.');
      setStatus('error');
      return;
    }

    if (text.length > 100000) {
      setError('Текст слишком длинный для анализа. Максимум 100,000 символов.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError(null);
    setIsComparing(false);
    
    try {
      const result = await analyzeTranscript(text.trim());
      setData(result);
      setStatus('success');
      saveToHistory(result);
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Не удалось проанализировать стенограмму. Попробуйте снова.';
      setError(errorMessage);
      setStatus('error');
    }
  }, [saveToHistory]);

  const handleLoadHistory = useCallback((item: HistoryItem) => {
    setData(item.data);
    setStatus('success');
    setIsComparing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleCompare = useCallback((item: HistoryItem) => {
    setCompareList(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.filter(i => i.id !== item.id);
      if (prev.length >= COMPARE_LIMIT) return prev;
      return [...prev, item];
    });
  }, []);

  const startComparison = useCallback(() => {
    if (compareList.length === COMPARE_LIMIT) {
      setIsComparing(true);
      setStatus('success');
      setData(null);
    }
  }, [compareList.length]);

  const resetAnalysis = useCallback(() => {
    setStatus('idle');
    setData(null);
    setProgress(0);
    setIsComparing(false);
    setCompareList([]);
  }, []);

  const canCompare = useMemo(() => 
    compareList.length > 0 && !isComparing, [compareList.length, isComparing]
  );

  const showInput = useMemo(() => 
    ['idle', 'loading', 'error'].includes(status) && !isComparing, [status, isComparing]
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      
      {/* Progress Bar */}
      {status === 'loading' && (
        <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-slate-200 dark:bg-slate-800">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={resetAnalysis}
            className="flex items-center gap-3 group"
          >
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              PsychoAnalyze <span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </h1>
          </button>
          
          <div className="flex items-center gap-3">
            {canCompare && (
              <button 
                onClick={startComparison}
                className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-full shadow-lg transition-all"
              >
                Сравнить ({compareList.length})
              </button>
            )}

            <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {status === 'success' && (
              <button 
                onClick={resetAnalysis}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Новый анализ
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {status === 'idle' && !isComparing && (
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold tracking-wide uppercase mb-6 inline-block border border-indigo-100 dark:border-indigo-800">
              Инструмент клинического исследования
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              Раскройте глубокие <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">психологические инсайты</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Анализируйте стенограммы интервью для выявления защитных механизмов, типов привязанности и эмоциональных траекторий с помощью продвинутого ИИ.
            </p>
          </div>
        )}

        {showInput && (
          <InputSection 
            onAnalyze={handleAnalyze} 
            isLoading={status === 'loading'} 
            history={history}
            onLoadHistory={handleLoadHistory}
            onSelectForCompare={toggleCompare}
            compareList={compareList}
          />
        )}

        {status === 'error' && (
          <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {status === 'success' && data && !isComparing && (
          <div className="mt-8">
            <Dashboard data={data} />
          </div>
        )}

        {isComparing && (
          <div className="mt-8">
            <ComparisonView items={compareList} onBack={() => setIsComparing(false)} />
          </div>
        )}

      </main>

      <footer className="mt-24 border-t border-slate-200 dark:border-slate-800 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
        <p>&copy; 2025 PsychoAnalyze AI. Powered by Google Gemini.</p>
      </footer>

    </div>
  );
}
