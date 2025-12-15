import React from 'react';
import { AnalysisResult, HistoryItem } from '../types';
import { ArrowLeft, Shield, Heart, Zap, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ComparisonViewProps {
  items: HistoryItem[];
  onBack: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ items, onBack }) => {
  if (items.length !== 2) return null;

  const [item1, item2] = items;
  const d1 = item1.data;
  const d2 = item2.data;

  // Prepare Chart Data (Comparing average emotions)
  const calcAvg = (data: any[], key: string) => 
    data.reduce((sum, curr) => sum + curr[key], 0) / (data.length || 1);

  const emotionData = [
    { name: 'Счастье', A: calcAvg(d1.emotionTrend, 'happiness'), B: calcAvg(d2.emotionTrend, 'happiness') },
    { name: 'Грусть', A: calcAvg(d1.emotionTrend, 'sadness'), B: calcAvg(d2.emotionTrend, 'sadness') },
    { name: 'Гнев', A: calcAvg(d1.emotionTrend, 'anger'), B: calcAvg(d2.emotionTrend, 'anger') },
    { name: 'Тревога', A: calcAvg(d1.emotionTrend, 'anxiety'), B: calcAvg(d2.emotionTrend, 'anxiety') },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к анализу
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
         <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">Сравнительный Анализ</h2>
         
         <div className="grid grid-cols-2 gap-8">
            {/* Header Info */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
               <div className="text-xs text-indigo-500 dark:text-indigo-400 uppercase font-bold mb-1">Интервью A</div>
               <div className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-2">{item1.summary}</div>
               <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{new Date(item1.timestamp).toLocaleDateString()}</div>
            </div>
             <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
               <div className="text-xs text-purple-500 dark:text-purple-400 uppercase font-bold mb-1">Интервью B</div>
               <div className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-2">{item2.summary}</div>
               <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{new Date(item2.timestamp).toLocaleDateString()}</div>
            </div>

            {/* Risk Level */}
            <div className="text-center p-4 border rounded-lg dark:border-slate-700">
               <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Уровень Риска</div>
               <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  d1.riskLevel === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                  d1.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                  'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
               }`}>
                  {d1.riskLevel === 'High' ? 'Высокий' : d1.riskLevel === 'Medium' ? 'Средний' : 'Низкий'}
               </span>
            </div>
            <div className="text-center p-4 border rounded-lg dark:border-slate-700">
               <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Уровень Риска</div>
               <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  d2.riskLevel === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                  d2.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                  'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
               }`}>
                  {d2.riskLevel === 'High' ? 'Высокий' : d2.riskLevel === 'Medium' ? 'Средний' : 'Низкий'}
               </span>
            </div>

            {/* Attachment */}
            <div className="p-4 border rounded-lg dark:border-slate-700">
               <div className="flex items-center gap-2 mb-2">
                 <Heart className="w-4 h-4 text-rose-500" />
                 <span className="font-bold text-slate-700 dark:text-slate-300">Привязанность</span>
               </div>
               <div className="text-lg text-rose-600 dark:text-rose-400 font-semibold">{d1.attachmentProfile.style}</div>
               <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2">
                 <div className="bg-rose-500 h-1.5 rounded-full" style={{width: `${d1.attachmentProfile.confidence}%`}}></div>
               </div>
            </div>
            <div className="p-4 border rounded-lg dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                 <Heart className="w-4 h-4 text-rose-500" />
                 <span className="font-bold text-slate-700 dark:text-slate-300">Привязанность</span>
               </div>
               <div className="text-lg text-rose-600 dark:text-rose-400 font-semibold">{d2.attachmentProfile.style}</div>
               <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2">
                 <div className="bg-rose-500 h-1.5 rounded-full" style={{width: `${d2.attachmentProfile.confidence}%`}}></div>
               </div>
            </div>

            {/* Defense Mechanisms */}
            <div className="p-4 border rounded-lg dark:border-slate-700">
               <div className="flex items-center gap-2 mb-2">
                 <Shield className="w-4 h-4 text-emerald-500" />
                 <span className="font-bold text-slate-700 dark:text-slate-300">Защитные механизмы</span>
               </div>
               <ul className="text-sm space-y-1">
                 {d1.defenseMechanisms.slice(0, 3).map((m, i) => (
                   <li key={i} className="flex justify-between text-slate-600 dark:text-slate-400">
                     <span>{m.name}</span>
                     <span className="text-xs font-bold opacity-70">{m.frequency}</span>
                   </li>
                 ))}
               </ul>
            </div>
             <div className="p-4 border rounded-lg dark:border-slate-700">
               <div className="flex items-center gap-2 mb-2">
                 <Shield className="w-4 h-4 text-emerald-500" />
                 <span className="font-bold text-slate-700 dark:text-slate-300">Защитные механизмы</span>
               </div>
               <ul className="text-sm space-y-1">
                 {d2.defenseMechanisms.slice(0, 3).map((m, i) => (
                   <li key={i} className="flex justify-between text-slate-600 dark:text-slate-400">
                     <span>{m.name}</span>
                     <span className="text-xs font-bold opacity-70">{m.frequency}</span>
                   </li>
                 ))}
               </ul>
            </div>
         </div>

         {/* Comparison Chart */}
         <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 text-center">Сравнение эмоционального фона (Среднее)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.3} />
                  <XAxis dataKey="name" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="A" name="Интервью A" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="B" name="Интервью B" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

      </div>
    </div>
  );
};

export default ComparisonView;
