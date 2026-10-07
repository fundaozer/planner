export type TaskCategory = 'Ders' | 'İş' | 'Kişisel';

export type TaskPriority = 'Düşük' | 'Orta' | 'Yüksek';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  scheduledDate: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedPomodoros: number;
  notes?: string;
  subtasks?: Subtask[];
}

export type FilterType = 'bugun' | 'tumu' | 'tamamlananlar';

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

export type AmbientSoundType = 'none' | 'rain' | 'waves' | 'fire' | 'cafe';

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  soundEnabled: boolean;
  ambientSound: AmbientSoundType;
  ambientVolume: number;
}

export interface PomodoroSessionRecord {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  completedAt: string;
  mode: PomodoroMode;
}

export interface PlannerBackupData {
  version: string;
  exportedAt: string;
  tasks: Task[];
  pomodoroSessions: PomodoroSessionRecord[];
  pomodoroSettings: PomodoroSettings;
  theme: 'light' | 'dark';
  language: 'tr' | 'en';
}
