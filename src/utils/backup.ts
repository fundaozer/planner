import type { Task, PomodoroSettings, PomodoroSessionRecord, PlannerBackupData } from '../interfaces';
import type { Language } from '../i18n/translations';
import { getTodayDateString } from './date';

// JSON yedek indirme
export const exportBackupJSON = (
  tasks: Task[],
  pomodoroSessions: PomodoroSessionRecord[],
  pomodoroSettings: PomodoroSettings,
  theme: 'light' | 'dark',
  language: Language
) => {
  const data: PlannerBackupData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    tasks,
    pomodoroSessions,
    pomodoroSettings,
    theme,
    language,
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `planner_backup_${getTodayDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// CSV görev tablosu indirme
export const exportTasksCSV = (tasks: Task[], lang: Language = 'tr') => {
  const headers =
    lang === 'tr'
      ? ['ID', 'Başlık', 'Kategori', 'Öncelik', 'Planlanan Gün', 'Son Teslim Tarihi', 'Durum', 'Pomodoro Sayısı', 'Notlar', 'Alt Görevler']
      : ['ID', 'Title', 'Category', 'Priority', 'Scheduled Date', 'Due Date', 'Status', 'Pomodoro Count', 'Notes', 'Subtasks'];

  const rows = tasks.map((task) => {
    const subtaskSummary = task.subtasks && task.subtasks.length > 0
      ? task.subtasks.map((s) => `${s.completed ? '[x]' : '[ ]'} ${s.title}`).join(' | ')
      : '';

    return [
      `"${task.id}"`,
      `"${(task.title || '').replace(/"/g, '""')}"`,
      `"${task.category}"`,
      `"${task.priority}"`,
      `"${task.scheduledDate || ''}"`,
      `"${task.dueDate || ''}"`,
      `"${task.completed ? (lang === 'tr' ? 'Tamamlandı' : 'Completed') : (lang === 'tr' ? 'Bekliyor' : 'Pending')}"`,
      `"${task.completedPomodoros || 0}"`,
      `"${(task.notes || '').replace(/"/g, '""')}"`,
      `"${subtaskSummary.replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `planner_tasks_${getTodayDateString()}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// JSON yedek yükleme
export const importBackupJSON = (file: File): Promise<PlannerBackupData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
          throw new Error('Geçersiz dosya formatı.');
        }

        resolve(parsed as PlannerBackupData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsText(file);
  });
};
