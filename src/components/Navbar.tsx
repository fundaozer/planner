import React from 'react';
import { Sparkles, Moon, Sun, Clock, CheckCircle2, ListTodo, Globe, HardDrive } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface NavbarProps {
  activeTab: 'tasks' | 'pomodoro';
  onTabChange: (tab: 'tasks' | 'pomodoro') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  pendingTasksCount: number;
  language: Language;
  onToggleLanguage: () => void;
  onOpenBackupModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  pendingTasksCount,
  language,
  onToggleLanguage,
  onOpenBackupModal,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer min-w-0"
            onClick={() => onTabChange('tasks')}
          >
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md sm:shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-100 dark:to-slate-200 bg-clip-text text-transparent truncate">
                  {t.appTitle}
                </h1>
                {pendingTasksCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-sm flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{pendingTasksCount}</span>
                  </span>
                )}
              </div>
              <p className="hidden sm:flex text-xs font-semibold tracking-wide bg-gradient-to-r from-indigo-600 to-sky-600 dark:from-indigo-400 dark:to-sky-400 bg-clip-text text-transparent items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>{t.appSubtitle}</span>
              </p>
            </div>
          </div>

          {/* Menü ve Aksiyonlar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Desktop / Tablet Sekmeler */}
            <nav className="hidden md:flex items-center p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 shadow-inner">
              <button
                type="button"
                onClick={() => onTabChange('tasks')}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'tasks'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-md shadow-slate-950/5 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span>{t.tasksTab}</span>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('pomodoro')}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'pomodoro'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-md shadow-slate-950/5 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{t.pomodoroTab}</span>
              </button>
            </nav>

            {/* Yedekleme */}
            <button
              type="button"
              onClick={onOpenBackupModal}
              title={language === 'tr' ? 'Veri Yedekle & Aktar' : 'Backup & Export Data'}
              aria-label={language === 'tr' ? 'Veri Yedekle' : 'Backup'}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <HardDrive className="w-4 h-4 text-indigo-500" />
            </button>

            {/* Dil (TR/EN) */}
            <button
              type="button"
              onClick={onToggleLanguage}
              title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span className="uppercase tracking-wider text-[11px] sm:text-xs">{language === 'tr' ? 'EN' : 'TR'}</span>
            </button>

            {/* Tema */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={isDark ? t.themeLight : t.themeDark}
              aria-label={isDark ? t.themeLight : t.themeDark}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
