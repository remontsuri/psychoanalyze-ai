import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Globe, History, Clock, ArrowRight, Search, CheckCircle } from 'lucide-react';
import { HistoryItem } from '../types';

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
  onSelectForCompare: (item: HistoryItem) => void;
  compareList: HistoryItem[];
}

const InputSection: React.FC<InputSectionProps> = ({ 
  onAnalyze, 
  isLoading, 
  history, 
  onLoadHistory,
  onSelectForCompare,
  compareList
}) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setText('');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredHistory = history.filter(item => 
    item.summary.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.data.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Main Input Area */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-slate-700 p-6 relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Ввод стенограммы
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600">
              <Globe className="w-3.5 h-3.5" />
              <span>Авто-определение языка</span>
            </div>
          </div>

          <div className="relative group">
            <textarea
              className="w-full h-72 p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all resize-none text-slate-700 dark:text-slate-300 font-mono text-sm leading-relaxed outline-none"
              placeholder="Вставьте текст интервью сюда или загрузите файл..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
            {text && (
              <button
                onClick={handleClear}
                className="absolute top-4 right-4 p-1.5 bg-white dark:bg-slate-700 rounded-full shadow-sm border border-slate-200 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Очистить"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <input
                type="file"
                accept=".txt,.md,.csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm font-semibold w-full sm:w-auto"
              >
                <Upload className="w-4 h-4" />
                {fileName ? 'Файл выбран' : 'Загрузить файл'}
              </label>
              {fileName && <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{fileName}</span>}
            </div>

            <button
              onClick={() => onAnalyze(text)}
              disabled={!text.trim() || isLoading}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${
                !text.trim() || isLoading
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
              }`}
            >
              {isLoading ? 'Анализ...' : 'Анализировать'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 h-full max-h-[500px] flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4" />
                История
             </h3>
             {compareList.length > 0 && (
               <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                 Сравнение: {compareList.length}
               </span>
             )}
          </div>
          
          <div className="relative mb-3">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Поиск..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-600 text-sm">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                {history.length === 0 ? 'Нет анализов' : 'Ничего не найдено'}
              </div>
            ) : (
              filteredHistory.map((item) => {
                const isSelectedForCompare = compareList.some(c => c.id === item.id);
                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => onLoadHistory(item)}
                      className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                          {item.data.language}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                        {item.summary}
                      </p>
                    </button>
                    <button 
                      onClick={(e) => {
                         e.stopPropagation();
                         onSelectForCompare(item);
                      }}
                      className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                        isSelectedForCompare 
                          ? 'text-indigo-600 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900' 
                          : 'text-slate-300 hover:text-indigo-500 dark:text-slate-600 dark:hover:text-indigo-400'
                      }`}
                      title={isSelectedForCompare ? "Убрать из сравнения" : "Добавить к сравнению"}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
