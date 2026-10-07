import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  AlertTriangle,
  BookOpen,
  Briefcase,
  User,
  Check,
  Play,
  Flame,
  ChevronDown,
  ChevronUp,
  CheckSquare,
} from 'lucide-react';
import type { Task, TaskCategory, TaskPriority } from '../interfaces';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { isOverdue, formatDisplayDate } from '../utils/date';
import { triggerConfetti } from '../utils/confetti';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onStartPomodoroForTask?: (task: Task) => void;
  language: Language;
}

// Kategoriye özel rozet stilleri ve ikonları
const getCategoryDetails = (category: TaskCategory, lang: Language) => {
  const t = translations[lang];
  switch (category) {
    case 'Ders':
      return {
        label: t.catStudy,
        icon: BookOpen,
        badgeClass:
          'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      };
    case 'İş':
      return {
        label: t.catWork,
        icon: Briefcase,
        badgeClass:
          'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      };
    case 'Kişisel':
      return {
        label: t.catPersonal,
        icon: User,
        badgeClass:
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      };
  }
};

// Öncelik seviyesine özel stiller
const getPriorityDetails = (priority: TaskPriority, lang: Language) => {
  const t = translations[lang];
  switch (priority) {
    case 'Yüksek':
      return {
        label: t.prioHigh,
        badgeClass:
          'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-900',
        dotClass: 'bg-rose-500',
      };
    case 'Orta':
      return {
        label: t.prioMedium,
        badgeClass:
          'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900',
        dotClass: 'bg-amber-500',
      };
    case 'Düşük':
      return {
        label: t.prioLow,
        badgeClass:
          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        dotClass: 'bg-slate-400',
      };
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onToggleSubtask,
  onStartPomodoroForTask,
  language,
}) => {
  const t = translations[language];
  const [showSubtasks, setShowSubtasks] = useState(true);

  const overdue = isOverdue(task.dueDate, task.completed);
  const scheduledDateInfo = formatDisplayDate(task.scheduledDate, language);
  const dueDateInfo = formatDisplayDate(task.dueDate, language);
  const categoryDetails = getCategoryDetails(task.category, language);
  const priorityDetails = getPriorityDetails(task.priority, language);
  const CategoryIcon = categoryDetails.icon;

  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

  const handleCheckboxClick = () => {
    if (!task.completed) {
      triggerConfetti('small');
    }
    onToggleComplete(task.id);
  };

  return (
    <div
      className={`group relative rounded-3xl border p-4 sm:p-5 transition-all duration-300 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/60 opacity-75'
          : overdue
          ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-300/90 dark:border-rose-800/80 shadow-sm shadow-rose-500/10 hover:border-rose-400'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Tamamlama Butonu / Checkbox */}
        <button
          type="button"
          onClick={handleCheckboxClick}
          aria-label={task.completed ? 'Mark uncompleted' : 'Mark completed'}
          className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center border transition-all duration-200 flex-shrink-0 cursor-pointer ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
          }`}
        >
          {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Görev Detayları */}
        <div className="flex-1 min-w-0">
          {/* Başlık ve Eylemler */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-base font-bold leading-snug break-words ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h3>

            {/* Hızlı Eylem Butonları */}
            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              {onStartPomodoroForTask && !task.completed && (
                <button
                  type="button"
                  onClick={() => onStartPomodoroForTask(task)}
                  title={t.cardFocusTitle}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onEdit(task)}
                title={t.cardEditTitle}
                className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/50 dark:hover:text-sky-300 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                title={t.cardDeleteTitle}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notlar */}
          {task.notes && (
            <p
              className={`mt-1 text-xs sm:text-sm leading-relaxed ${
                task.completed
                  ? 'text-slate-400 dark:text-slate-600 line-through'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {task.notes}
            </p>
          )}

          {/* Alt Görevler (Checklist) Gösterimi */}
          {totalSubtasks > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    {language === 'tr' ? 'Alt Görevler' : 'Subtasks'} ({completedSubtasks}/{totalSubtasks})
                  </span>
                  {showSubtasks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                  />
                </div>
              </div>

              {showSubtasks && task.subtasks && (
                <div className="space-y-1.5 pl-1">
                  {task.subtasks.map((sub) => (
                    <label
                      key={sub.id}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => onToggleSubtask && onToggleSubtask(task.id, sub.id)}
                        className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className={sub.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                        {sub.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Etiketler, Tarih ve Rozetler */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
            {/* Kategori Rozeti */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${categoryDetails.badgeClass}`}
            >
              <CategoryIcon className="w-3 h-3" />
              <span>{categoryDetails.label}</span>
            </span>

            {/* Öncelik Rozeti */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${priorityDetails.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityDetails.dotClass}`} />
              <span>{priorityDetails.label}</span>
            </span>

            {/* Planlanan Gün */}
            {task.scheduledDate && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                  scheduledDateInfo.isCurrentDay
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Clock className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                <span>{t.datePlanPrefix} {scheduledDateInfo.label}</span>
              </span>
            )}

            {/* Son Tarih Bilgisi (Gecikmişse Kırmızı Vurgulanır) */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                overdue
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800 ring-1 ring-rose-400/30'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {overdue ? (
                <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
              ) : (
                <Calendar className="w-3 h-3 text-slate-400" />
              )}
              <span>
                {overdue
                  ? `${t.dateOverduePrefix} (${dueDateInfo.label})`
                  : `${t.dateDuePrefix} ${dueDateInfo.label}`}
              </span>
            </span>

            {/* Tamamlanan Odaklanma Oturumu Sayısı */}
            {typeof task.completedPomodoros === 'number' && task.completedPomodoros > 0 && (
              <span
                title={`${task.completedPomodoros} ${t.cardSessionsLabel}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60"
              >
                <Flame className="w-3 h-3 text-amber-500" />
                <span>{task.completedPomodoros} {t.cardSessionsLabel}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
