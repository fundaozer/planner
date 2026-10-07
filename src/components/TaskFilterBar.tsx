import React from 'react';
import { Plus, Search, Filter, X, Calendar, Layers, CheckCircle2 } from 'lucide-react';
import type { FilterType, TaskCategory, TaskPriority } from '../interfaces';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface TaskFilterBarProps {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: TaskCategory | 'All';
  onCategoryChange: (c: TaskCategory | 'All') => void;
  selectedPriority: TaskPriority | 'All';
  onPriorityChange: (p: TaskPriority | 'All') => void;
  onOpenNewTaskModal: () => void;
  counts: {
    bugun: number;
    tumu: number;
    tamamlananlar: number;
  };
  language: Language;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  onOpenNewTaskModal,
  counts,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-2.5 sm:space-y-4 mb-3 sm:mb-6">
      {/* Filtre Sekmeleri & Yeni Görev Butonu */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3.5">
        <div className="grid grid-cols-3 sm:inline-flex p-0.5 sm:p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl sm:rounded-2xl border border-slate-300/40 dark:border-slate-700/60 shadow-inner gap-0.5">
          <button
            type="button"
            onClick={() => onFilterChange('bugun')}
            className={`flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              filter === 'bugun'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm sm:shadow-md shadow-slate-950/5 scale-[1.01]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">{t.filterToday}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] font-black ${
                filter === 'bugun'
                  ? 'bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-200'
                  : 'bg-slate-300/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {counts.bugun}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('tumu')}
            className={`flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              filter === 'tumu'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm sm:shadow-md shadow-slate-950/5 scale-[1.01]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">{t.filterAll}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] font-black ${
                filter === 'tumu'
                  ? 'bg-sky-100 dark:bg-sky-900/70 text-sky-700 dark:text-sky-200'
                  : 'bg-slate-300/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {counts.tumu}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('tamamlananlar')}
            className={`flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              filter === 'tamamlananlar'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm sm:shadow-md shadow-slate-950/5 scale-[1.01]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">{language === 'tr' ? 'Biten' : t.filterCompleted}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] font-black ${
                filter === 'tamamlananlar'
                  ? 'bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-200'
                  : 'bg-slate-300/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {counts.tamamlananlar}
            </span>
          </button>
        </div>

        {/* Yeni Görev Butonu */}
        <button
          type="button"
          onClick={onOpenNewTaskModal}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-500 hover:via-indigo-500 hover:to-sky-500 text-white font-black text-xs sm:text-sm shadow-md sm:shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t.addNewTask}</span>
        </button>
      </div>

      {/* Arama ve Filtreler */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
        {/* Arama Kutusu */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-1.5 sm:py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Kategori ve Öncelik Seçici */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2.5">
          <div className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm min-w-0">
            <Filter className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold flex-shrink-0">{t.categoryLabel}</span>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as TaskCategory | 'All')}
              className="text-[11px] sm:text-xs font-bold bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer w-full truncate"
            >
              <option value="All" className="dark:bg-slate-900">{t.allOption}</option>
              <option value="Ders" className="dark:bg-slate-900">{t.catStudy}</option>
              <option value="İş" className="dark:bg-slate-900">{t.catWork}</option>
              <option value="Kişisel" className="dark:bg-slate-900">{t.catPersonal}</option>
            </select>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm min-w-0">
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold flex-shrink-0">{t.priorityLabel}</span>
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'All')}
              className="text-[11px] sm:text-xs font-bold bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer w-full truncate"
            >
              <option value="All" className="dark:bg-slate-900">{t.allOption}</option>
              <option value="Yüksek" className="dark:bg-slate-900">{t.prioHigh}</option>
              <option value="Orta" className="dark:bg-slate-900">{t.prioMedium}</option>
              <option value="Düşük" className="dark:bg-slate-900">{t.prioLow}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
