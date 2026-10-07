import React from 'react';
import { CheckCircle2, Calendar, AlertCircle, Layers } from 'lucide-react';
import type { Task } from '../interfaces';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { isToday, isOverdue } from '../utils/date';

interface TaskSummaryStatsProps {
  tasks: Task[];
  onSelectFilter: (filter: 'bugun' | 'tumu' | 'tamamlananlar') => void;
  activeFilter: 'bugun' | 'tumu' | 'tamamlananlar';
  language: Language;
}

export const TaskSummaryStats: React.FC<TaskSummaryStatsProps> = ({
  tasks,
  onSelectFilter,
  activeFilter,
  language,
}) => {
  const t = translations[language];
  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const todayCount = tasks.filter(
    (task) => (isToday(task.scheduledDate) || isToday(task.dueDate)) && !task.completed
  ).length;
  const overdueCount = tasks.filter((task) => isOverdue(task.dueDate, task.completed)).length;

  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-6">
      {/* Toplam */}
      <button
        type="button"
        onClick={() => onSelectFilter('tumu')}
        className={`p-2.5 sm:p-4 md:p-5 rounded-xl sm:rounded-3xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden group ${
          activeFilter === 'tumu'
            ? 'bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent border-sky-500/50 ring-2 ring-sky-500/30 shadow-sm sm:shadow-md shadow-sky-500/10 scale-[1.01]'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md'
        }`}
      >
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.statsTotal}
          </span>
          <div className="w-6 h-6 sm:w-8 sm:h-9 rounded-lg sm:rounded-2xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Layers className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalCount}
          </span>
          <span className="text-[9px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{t.statsTasksUnit}</span>
        </div>
      </button>

      {/* Bugün */}
      <button
        type="button"
        onClick={() => onSelectFilter('bugun')}
        className={`p-2.5 sm:p-4 md:p-5 rounded-xl sm:rounded-3xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden group ${
          activeFilter === 'bugun'
            ? 'bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/50 ring-2 ring-indigo-500/30 shadow-sm sm:shadow-md shadow-indigo-500/10 scale-[1.01]'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
        }`}
      >
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {t.statsToday}
          </span>
          <div className="w-6 h-6 sm:w-8 sm:h-9 rounded-lg sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {todayCount}
          </span>
          <span className="text-[9px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">{t.statsPendingUnit}</span>
        </div>
      </button>

      {/* Tamamlanan */}
      <button
        type="button"
        onClick={() => onSelectFilter('tamamlananlar')}
        className={`p-2.5 sm:p-4 md:p-5 rounded-xl sm:rounded-3xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden group ${
          activeFilter === 'tamamlananlar'
            ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/50 ring-2 ring-emerald-500/30 shadow-sm sm:shadow-md shadow-emerald-500/10 scale-[1.01]'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md'
        }`}
      >
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {t.statsCompleted}
          </span>
          <div className="w-6 h-6 sm:w-8 sm:h-9 rounded-lg sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {completedCount}
          </span>
          <span className="text-[9px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
            %{completionPercentage}
          </span>
        </div>
      </button>

      {/* Geciken */}
      <div
        className={`p-2.5 sm:p-4 md:p-5 rounded-xl sm:rounded-3xl border transition-all duration-300 relative overflow-hidden ${
          overdueCount > 0
            ? 'bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent border-rose-300 dark:border-rose-800 shadow-sm sm:shadow-md shadow-rose-500/10'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
            {t.statsOverdue}
          </span>
          <div
            className={`w-6 h-6 sm:w-8 sm:h-9 rounded-lg sm:rounded-2xl flex items-center justify-center ${
              overdueCount > 0
                ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
          >
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {overdueCount}
          </span>
          <span className="text-[9px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 truncate">
            {overdueCount > 0 ? t.statsOverdueAlert : t.statsOverdueNone}
          </span>
        </div>
      </div>
    </div>
  );
};
