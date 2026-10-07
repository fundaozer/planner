import { useState, useEffect } from 'react';
import type { Task, PomodoroSettings, PomodoroSessionRecord, PlannerBackupData } from './interfaces';
import type { Language } from './i18n/translations';
import { translations } from './i18n/translations';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  getStoredTheme,
  saveThemeToStorage,
  getStoredLanguage,
  saveLanguageToStorage,
  loadPomodoroSettings,
  savePomodoroSettings,
  loadPomodoroSessions,
  savePomodoroSessions,
} from './utils/storage';
import { Navbar, BackupModal } from './components';
import { TasksPage, PomodoroPage } from './pages';

export function App() {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [activeTab, setActiveTab] = useState<'tasks' | 'pomodoro'>('tasks');
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(() =>
    loadPomodoroSettings()
  );
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSessionRecord[]>(() =>
    loadPomodoroSessions()
  );
  const [selectedTaskForPomodoro, setSelectedTaskForPomodoro] = useState<Task | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Dil senkronizasyonu
  useEffect(() => {
    document.documentElement.lang = language;
    saveLanguageToStorage(language);
  }, [language]);

  // Tema senkronizasyonu
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveThemeToStorage(theme);
  }, [theme]);

  // Depolama senkronizasyonları
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    savePomodoroSettings(pomodoroSettings);
  }, [pomodoroSettings]);

  useEffect(() => {
    savePomodoroSessions(pomodoroSessions);
  }, [pomodoroSessions]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      completedPomodoros: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId || !t.subtasks) return t;
        const updatedSubs = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subtasks: updatedSubs };
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleStartPomodoroForTask = (task: Task) => {
    setSelectedTaskForPomodoro(task);
    setActiveTab('pomodoro');
  };

  const handlePomodoroCompleted = (taskId?: string, durationMinutes: number = 25) => {
    let taskTitle = language === 'tr' ? 'Genel Odaklanma' : 'General Focus';

    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        taskTitle = task.title;
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, completedPomodoros: (t.completedPomodoros || 0) + 1 }
              : t
          )
        );
      }
    }

    const newSession: PomodoroSessionRecord = {
      id: `session-${Date.now()}`,
      taskId,
      taskTitle,
      durationMinutes,
      completedAt: new Date().toISOString(),
      mode: 'work',
    };

    setPomodoroSessions((prev) => [newSession, ...prev]);
  };

  const handleRestoreBackup = (data: PlannerBackupData) => {
    if (data.tasks) setTasks(data.tasks);
    if (data.pomodoroSessions) setPomodoroSessions(data.pomodoroSessions);
    if (data.pomodoroSettings) setPomodoroSettings(data.pomodoroSettings);
    if (data.theme) setTheme(data.theme);
    if (data.language) setLanguage(data.language);
  };

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Üst Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
        pendingTasksCount={pendingTasksCount}
        language={language}
        onToggleLanguage={toggleLanguage}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      {/* Sayfa İçeriği */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-24 md:pb-8">
        {activeTab === 'tasks' ? (
          <TasksPage
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onToggleSubtask={handleToggleSubtask}
            onStartPomodoroForTask={handleStartPomodoroForTask}
            language={language}
          />
        ) : (
          <PomodoroPage
            tasks={tasks}
            selectedTaskForPomodoro={selectedTaskForPomodoro}
            onSelectTaskForPomodoro={setSelectedTaskForPomodoro}
            onPomodoroCompleted={handlePomodoroCompleted}
            sessions={pomodoroSessions}
            settings={pomodoroSettings}
            onUpdateSettings={setPomodoroSettings}
            language={language}
          />
        )}
      </main>

      {/* Yedekleme Penceresi */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        tasks={tasks}
        pomodoroSessions={pomodoroSessions}
        pomodoroSettings={pomodoroSettings}
        theme={theme}
        language={language}
        onRestoreBackup={handleRestoreBackup}
      />

      {/* Mobil Alt Menü (Bottom Navigation Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-2 pb-safe shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center gap-1 py-1 px-5 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === 'tasks'
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
            }`}
          >
            <div className="relative">
              <span className="flex items-center justify-center w-6 h-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === 'tasks' ? 2.5 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </span>
              {pendingTasksCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[9px] font-black">
                  {pendingTasksCount}
                </span>
              )}
            </div>
            <span className="text-[11px]">{t.tasksTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pomodoro')}
            className={`flex flex-col items-center gap-1 py-1 px-5 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === 'pomodoro'
                ? 'text-rose-600 dark:text-rose-400 font-extrabold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
            }`}
          >
            <span className="flex items-center justify-center w-6 h-6">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === 'pomodoro' ? 2.5 : 2}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
              </svg>
            </span>
            <span className="text-[11px]">{t.pomodoroTab}</span>
          </button>
        </div>
      </nav>

      {/* Alt Bilgi */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 mb-16 md:mb-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            {t.appTitle} &bull; {t.appSubtitle}
          </p>
          <p>{t.footerPrivacy}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
