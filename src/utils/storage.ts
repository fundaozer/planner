import type { Task, PomodoroSettings, PomodoroSessionRecord } from '../interfaces';
import type { Language } from '../i18n/translations';
import { getTodayDateString } from './date';

const STORAGE_KEY_TASKS = 'planner_tasks_v3';
const STORAGE_KEY_THEME = 'planner_theme_v3';
const STORAGE_KEY_LANG = 'planner_lang_v3';
const STORAGE_KEY_POMODORO_SETTINGS = 'planner_pomodoro_settings_v3';
const STORAGE_KEY_POMODORO_SESSIONS = 'planner_pomodoro_sessions_v3';

export const getDefaultTasks = (): Task[] => {
  const today = getTodayDateString();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const future = new Date();
  future.setDate(future.getDate() + 3);
  const futureStr = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`;

  return [
    {
      id: 'task-1',
      title: 'Algoritma Ödevini Tamamla',
      category: 'Ders',
      priority: 'Yüksek',
      scheduledDate: today,
      dueDate: futureStr,
      completed: false,
      createdAt: new Date().toISOString(),
      completedPomodoros: 0,
      notes: 'Sıralama algoritmaları ve karmaşıklık analizi yazılacak.'
    },
    {
      id: 'task-2',
      title: 'İngilizce Çalış (Kelime & Dinleme)',
      category: 'Kişisel',
      priority: 'Orta',
      scheduledDate: today,
      dueDate: today,
      completed: false,
      createdAt: new Date().toISOString(),
      completedPomodoros: 0,
      notes: 'Günde 20 yeni kelime tekrarı ve 1 podcast dinleme.'
    },
    {
      id: 'task-3',
      title: 'Kitap Oku (En az 30 sayfa)',
      category: 'Kişisel',
      priority: 'Düşük',
      scheduledDate: tomorrowStr,
      dueDate: tomorrowStr,
      completed: false,
      createdAt: new Date().toISOString(),
      completedPomodoros: 0,
      notes: 'Akşam yatmadan önce 30 sayfa okuma.'
    }
  ];
};

export const loadTasksFromStorage = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (!raw) {
      const initial = getDefaultTasks();
      saveTasksToStorage(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Görevler yüklenirken hata:', error);
    return getDefaultTasks();
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Görevler kaydedilirken hata:', error);
  }
};

export const getStoredLanguage = (): Language => {
  try {
    const lang = localStorage.getItem(STORAGE_KEY_LANG);
    if (lang === 'tr' || lang === 'en') return lang;
    return 'tr';
  } catch {
    return 'tr';
  }
};

export const saveLanguageToStorage = (lang: Language): void => {
  try {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  } catch (err) {
    console.error('Dil kaydedilemedi:', err);
  }
};

export const getStoredTheme = (): 'light' | 'dark' => {
  try {
    const theme = localStorage.getItem(STORAGE_KEY_THEME);
    if (theme === 'dark' || theme === 'light') return theme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
};

export const saveThemeToStorage = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch (error) {
    console.error('Tema kaydedilemedi:', error);
  }
};

export const getDefaultPomodoroSettings = (): PomodoroSettings => ({
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  soundEnabled: true,
  ambientSound: 'none',
  ambientVolume: 0.5,
});

export const loadPomodoroSettings = (): PomodoroSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POMODORO_SETTINGS);
    if (!raw) return getDefaultPomodoroSettings();
    return { ...getDefaultPomodoroSettings(), ...JSON.parse(raw) };
  } catch {
    return getDefaultPomodoroSettings();
  }
};

export const savePomodoroSettings = (settings: PomodoroSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY_POMODORO_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Pomodoro ayarları kaydedilemedi:', err);
  }
};

export const loadPomodoroSessions = (): PomodoroSessionRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POMODORO_SESSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const savePomodoroSessions = (sessions: PomodoroSessionRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_POMODORO_SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Pomodoro oturumları kaydedilemedi:', err);
  }
};
