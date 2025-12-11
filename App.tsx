import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import Dashboard from './components/Dashboard';
import ComparisonView from './components/ComparisonView';
import { AnalysisResult, AnalysisStatus, HistoryItem } from './types';
import { analyzeTranscript } from './services/geminiService';
import { BrainCircuit, AlertCircle, PlusCircle, Moon, Sun, Scale } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [compareList, setCompareList] = useState<HistoryItem[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  
  // Dark mode
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system pref or saved pref
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('psychoanalyze_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Simulated progress bar logic
  useEffect(() => {
    let interval: number;
    if (status === 'loading') {
      setProgress(0);
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          // Logarithmic slowdown
          const increment = Math.max(0.5, (90 - prev) / 20);
          return prev + increment;
        });
      }, 300);
    } else if (status === 'success') {
      setProgress(100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const saveToHistory = (result: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      summary: result.summary.substring(0, 100) + '...',
      data: result,
      userRating: 0
    };
    const updated = [newItem, ...history].slice(0, 20); // Keep last 20
    setHistory(updated);
    localStorage.setItem('psychoanalyze_history', JSON.stringify(updated));
  };

  const handleUpdateRating = (rating: number) => {
    if (!data) return;
    // Update current history item in state
    const updatedHistory = history.map(item => {
      // Very naive check, normally we'd track currentID
      if (item.summary === data.summary.substring(0, 100) + '...' && Math.abs(item.timestamp - Date.now()) < 3600000) {
        return { ...item, userRating: rating };
      }
      return item;
    });
    setHistory(updatedHistory);
    localStorage.setItem('psychoanalyze_history', JSON.stringify(updatedHistory));
  };

  const handleAnalyze = async (text: string) => {
    setStatus('loading');
    setError(null);
    setIsComparing(false);
    try {
      const result = await analyzeTranscript(text);
      setData(result);
      setStatus('success');
      saveToHistory(result);
    } catch (err) {
      setError('Не удалось проанализировать стенограмму. Пожалуйста, проверьте длину текста и попробуйте снова.');
      setStatus('error');
    }
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setData(item.data);
    setStatus('success');
    setIsComparing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCompare = (item: HistoryItem) => {
    if (compareList.find(i => i.id === item.id)) {
      setCompareList(prev => prev.filter(i => i.id !== item.id));
    } else {
      if (compareList.length >= 2) {
        alert("Можно сравнивать только 2 анализа одновременно.");
        return;
      }
      setCompareList(prev => [...prev, item]);
    }
  };

  const startComparison = () => {
    if (compareList.length === 2) {
      setIsComparing(true);
      setStatus('success');
      setData(null);
    } else {
      alert("Выберите ровно 2 анализа для сравнения.");
    }
  };

  const resetAnalysis = () => {
    setStatus('idle');
    setData(null);
    setProgress(0);
    setIsComparing(false);
    setCompareList([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-20 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
      
      {/* Top Progress Bar */}
      {status === 'loading' && (
        <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-slate-200 dark:bg-slate-800">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={resetAnalysis}
          >
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                PsychoAnalyze <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {compareList.length > 0 && !isComparing && (
               <button 
                onClick={startComparison}
                className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-full shadow-lg transition-all animate-in zoom-in"
               >
                 Сравнить ({compareList.length})
               </button>
             )}

             <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
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
           <div className="text-center mb-16 animate-in fade-in duration-700 slide-in-from-bottom-4">
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

        {(status === 'idle' || status === 'loading' || status === 'error') && !isComparing && (
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
          <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300 animate-in fade-in slide-in-from-top-2 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {status === 'success' && data && !isComparing && (
          <div className="mt-8">
            <Dashboard 
              data={data} 
              onRate={handleUpdateRating}
            />
          </div>
        )}

        {isComparing && (
          <div className="mt-8">
            <ComparisonView items={compareList} onBack={() => setIsComparing(false)} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200 dark:border-slate-800 py-12 text-center text-slate-400 dark:text-slate-500 text-sm transition-colors">
        <p>&copy; {new Date().getFullYear()} PsychoAnalyze AI. Powered by Google Gemini.</p>
      </footer>

    </div>
  );
};

export default App;
