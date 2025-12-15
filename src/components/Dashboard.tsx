import React, { useRef, useState } from 'react';
import { AnalysisResult } from '../types';
import { Shield, Heart, Zap, Quote, BookOpen, Brain, Activity, Download, Copy, Check, Star, Stethoscope, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DashboardProps {
  data: AnalysisResult;
  onRate?: (rating: number) => void;
  userRating?: number;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
      title="Копировать"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ data, onRate, userRating }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [currentRating, setCurrentRating] = React.useState(userRating || 0);

  const handleRate = (r: number) => {
    setCurrentRating(r);
    if (onRate) onRate(r);
  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);
    
    try {
      const element = dashboardRef.current;
      // Temporary style change for capture (remove dark mode for PDF consistency or keep it?)
      // We will capture as is.
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null // Transparent to capture bg color
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('psychoanalysis-report.pdf');
    } catch (err) {
      console.error('Export failed', err);
      alert('Ошибка при создании PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ["Параметр", "Значение"],
      ["Резюме", data.summary],
      ["Язык", data.language],
      ["Уровень Риска", data.riskLevel],
      ["Тип привязанности", data.attachmentProfile.style],
      ["Уверенность (Привязанность)", data.attachmentProfile.confidence + "%"],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Общее");

    // Defense Mechanisms
    const defenseData = data.defenseMechanisms.map(d => ({
      Механизм: d.name,
      Описание: d.description,
      Частота: d.frequency,
      Пример: d.exampleQuote
    }));
    const wsDefense = XLSX.utils.json_to_sheet(defenseData);
    XLSX.utils.book_append_sheet(wb, wsDefense, "Защиты");

    // Emotions
    const wsEmotions = XLSX.utils.json_to_sheet(data.emotionTrend);
    XLSX.utils.book_append_sheet(wb, wsEmotions, "Эмоции");

    XLSX.writeFile(wb, "PsychoAnalysis_Result.xlsx");
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500 text-white shadow-red-200';
      case 'Medium': return 'bg-amber-500 text-white shadow-amber-200';
      default: return 'bg-emerald-500 text-white shadow-emerald-200';
    }
  };

  const riskLabel = data.riskLevel === 'High' ? 'Высокий' : data.riskLevel === 'Medium' ? 'Средний' : 'Низкий';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 print:hidden gap-4">
        {/* Rating System */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Оценка анализа:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => handleRate(star)} className="focus:outline-none transition-transform hover:scale-110">
                <Star className={`w-5 h-5 ${star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
           <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition-all text-sm font-medium"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all text-sm font-medium disabled:opacity-70"
          >
            {isExporting ? (
              <span className="animate-pulse">Создание PDF...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                PDF Отчет
              </>
            )}
          </button>
        </div>
      </div>

      <div ref={dashboardRef} className="bg-white dark:bg-slate-900 p-8 rounded-xl space-y-8 shadow-sm print:shadow-none print:p-0 transition-colors">
        
        {/* Header Summary */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-violet-900 p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                              <Brain className="w-6 h-6 text-indigo-200" />
                           </div>
                           <h2 className="text-3xl font-bold tracking-tight">Психологический Профиль</h2>
                        </div>
                        <p className="text-indigo-200 text-sm font-medium">Автоматизированный анализ</p>
                    </div>
                    <div className="flex gap-3">
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 ${getRiskColor(data.riskLevel)}`}>
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Риск: {riskLabel}</span>
                        </div>
                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center">
                            Язык: {data.language}
                        </span>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 relative group">
                  <div className="absolute top-4 right-4">
                    <button onClick={() => navigator.clipboard.writeText(data.summary)} className="text-white/50 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="leading-relaxed text-indigo-50 text-lg font-light">{data.summary}</p>
                </div>
            </div>
        </div>

        {/* Therapy Recommendations (New Section) */}
        {data.therapyRecommendations && data.therapyRecommendations.length > 0 && (
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-2xl border border-teal-100 dark:border-teal-800 p-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 dark:bg-teal-800 rounded-lg text-teal-600 dark:text-teal-200">
                   <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-teal-900 dark:text-teal-100">Терапевтические Рекомендации</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.therapyRecommendations.map((rec, i) => (
                   <div key={i} className="flex items-start gap-3 bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg border border-teal-100 dark:border-teal-900">
                      <div className="mt-1 w-5 h-5 rounded-full bg-teal-200 dark:bg-teal-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-teal-800 dark:text-teal-100">{i + 1}</div>
                      <p className="text-sm text-teal-900 dark:text-teal-100 leading-relaxed">{rec}</p>
                   </div>
                ))}
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Defense Mechanisms & Attachment */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-b border-emerald-100 dark:border-emerald-800 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Защитные механизмы</h3>
                </div>
                <div className="p-6 space-y-4">
                  {data.defenseMechanisms.map((mech, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{mech.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                          mech.frequency === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300' :
                          mech.frequency === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300' :
                          'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300'
                        }`}>
                          {mech.frequency === 'High' ? 'Часто' : mech.frequency === 'Medium' ? 'Средне' : 'Редко'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">{mech.description}</p>
                      <div className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-emerald-300 dark:border-emerald-600 pl-3 py-1 bg-white dark:bg-slate-800 rounded-r-md">
                        "{mech.exampleQuote}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 border-b border-rose-100 dark:border-rose-800 flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Тип привязанности</h3>
                </div>
                <div className="p-6">
                  <div className="text-center p-6 bg-rose-50/50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800 mb-6">
                    <div className="text-xl font-bold text-rose-700 dark:text-rose-300 mb-2">{data.attachmentProfile.style}</div>
                    <div className="w-full bg-rose-200 dark:bg-rose-900 rounded-full h-2 mb-1">
                      <div className="bg-rose-500 dark:bg-rose-400 h-2 rounded-full" style={{ width: `${data.attachmentProfile.confidence}%` }}></div>
                    </div>
                    <div className="text-xs text-rose-500 dark:text-rose-400 font-semibold uppercase tracking-wide">Уверенность: {data.attachmentProfile.confidence}%</div>
                  </div>
                  <ul className="space-y-3">
                    {data.attachmentProfile.indicators.map((ind, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                        {ind}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Middle Col: Charts & Themes */}
            <div className="space-y-8 lg:col-span-2">
              
              {/* Emotion Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all">
                 <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-b border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Эмоциональная траектория</h3>
                    </div>
                </div>
                <div className="p-6">
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.emotionTrend || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                        <XAxis 
                          dataKey="segment" 
                          tick={{fontSize: 10, fill: '#94a3b8'}} 
                          tickLine={false}
                          axisLine={{stroke: '#e2e8f0', opacity: 0.2}}
                        />
                        <YAxis 
                          domain={[0, 10]} 
                          tick={{fontSize: 10, fill: '#94a3b8'}} 
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} />
                        <Line type="monotone" dataKey="happiness" name="Счастье" stroke="#22c55e" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="sadness" name="Грусть" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="anger" name="Гнев" stroke="#ef4444" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="anxiety" name="Тревога" stroke="#eab308" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center text-xs text-slate-400 mt-4">Анализ по 10 хронологическим сегментам интервью</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-b border-amber-100 dark:border-amber-800 flex items-center gap-3">
                      <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">Триггеры</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {data.emotionalTriggers.map((trigger, i) => (
                        <div key={i} className="flex flex-col gap-1 pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                          <div className="flex justify-between items-center">
                             <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{trigger.trigger}</span>
                             <div className="flex gap-0.5">
                               {[...Array(5)].map((_, idx) => (
                                 <div key={idx} className={`w-1 h-3 rounded-full ${idx < trigger.intensity / 2 ? 'bg-amber-400' : 'bg-slate-200 dark:bg-slate-600'}`}></div>
                               ))}
                             </div>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">Реакция: {trigger.response}</span>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 border-b border-violet-100 dark:border-violet-800 flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">Темы</h3>
                    </div>
                     <div className="p-4 space-y-4">
                      {data.themes.map((theme, i) => (
                        <div key={i} className="relative pl-3">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-100 dark:bg-violet-900 rounded-full">
                              <div className="absolute top-0 left-0 w-full bg-violet-500 dark:bg-violet-400 rounded-full transition-all duration-1000" style={{height: `${theme.relevanceScore}%`}}></div>
                          </div>
                          <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-1">{theme.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{theme.description}</p>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                 <div className="p-4 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/30 dark:to-cyan-900/30 border-b border-sky-100 dark:border-sky-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Quote className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Ключевые Цитаты</h3>
                    </div>
                 </div>
                 <div className="p-6 grid grid-cols-1 gap-4">
                    {data.keyQuotes.map((q, i) => (
                        <div key={i} className="p-4 bg-sky-50/30 dark:bg-sky-900/10 rounded-xl border border-sky-100 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors relative group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <CopyButton text={q.text} />
                            </div>
                            <div className="flex gap-3">
                                <Quote className="w-8 h-8 text-sky-200 dark:text-sky-800 flex-shrink-0 -mt-1 transform rotate-180" />
                                <div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 italic mb-2 font-serif">"{q.text}"</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider bg-sky-100 dark:bg-sky-900 px-2 py-0.5 rounded-full">{q.category}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-500">{q.analysis}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>

            </div>
        </div>

         {/* Academic Notes */}
         <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">Научные заметки</h3>
                  <CopyButton text={data.academicNotes} />
              </div>
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none text-sm">
                  <pre className="whitespace-pre-wrap font-sans text-slate-600 dark:text-slate-300 bg-transparent p-0 border-0">{data.academicNotes}</pre>
              </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
