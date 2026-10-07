import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle, Plus, Check, Clock, CheckSquare, Trash2 } from 'lucide-react';
import type { Task, TaskCategory, TaskPriority, Subtask } from '../interfaces';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { getTodayDateString } from '../utils/date';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt'>, taskId?: string) => void;
  taskToEdit?: Task | null;
  language: Language;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  language,
}) => {
  const t = translations[language];
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Ders');
  const [priority, setPriority] = useState<TaskPriority>('Orta');
  const [scheduledDate, setScheduledDate] = useState(getTodayDateString());
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setScheduledDate(taskToEdit.scheduledDate || getTodayDateString());
      setDueDate(taskToEdit.dueDate || getTodayDateString());
      setNotes(taskToEdit.notes || '');
      setSubtasks(taskToEdit.subtasks || []);
      setNewSubtaskTitle('');
      setError('');
    } else {
      setTitle('');
      setCategory('Ders');
      setPriority('Orta');
      setScheduledDate(getTodayDateString());
      setDueDate(getTodayDateString());
      setNotes('');
      setSubtasks([]);
      setNewSubtaskTitle('');
      setError('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const getDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks((prev) => [...prev, newSub]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t.modalErrorTitle);
      return;
    }

    onSave(
      {
        title: title.trim(),
        category,
        priority,
        scheduledDate: scheduledDate || getTodayDateString(),
        dueDate: dueDate || scheduledDate || getTodayDateString(),
        notes: notes.trim(),
        subtasks: subtasks,
        completed: taskToEdit ? taskToEdit.completed : false,
        completedPomodoros: taskToEdit ? taskToEdit.completedPomodoros : 0,
      },
      taskToEdit ? taskToEdit.id : undefined
    );

    onClose();
  };

  const categoryOptions: { key: TaskCategory; label: string }[] = [
    { key: 'Ders', label: t.catStudy },
    { key: 'İş', label: t.catWork },
    { key: 'Kişisel', label: t.catPersonal },
  ];

  const priorityOptions: { key: TaskPriority; label: string }[] = [
    { key: 'Düşük', label: t.prioLow },
    { key: 'Orta', label: t.prioMedium },
    { key: 'Yüksek', label: t.prioHigh },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 flex items-center justify-center text-sky-600 dark:text-sky-400">
              {taskToEdit ? <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {taskToEdit ? t.modalEditTitle : t.modalAddTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-5 overflow-y-auto flex-1 overscroll-contain">
          {error && (
            <div className="flex items-center gap-2 p-2.5 sm:p-3 text-xs font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Görev Başlığı */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 sm:mb-2">
              {t.modalTaskTitleLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder={t.modalTaskTitlePlaceholder}
              autoFocus
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 sm:mb-2">
              {t.modalCategoryLabel}
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {categoryOptions.map((cat) => (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center cursor-pointer truncate ${
                    category === cat.key
                      ? cat.key === 'Ders'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-600/30'
                        : cat.key === 'İş'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-600/30'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Öncelik */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 sm:mb-2">
              {t.modalPriorityLabel}
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {priorityOptions.map((p) => (
                <button
                  type="button"
                  key={p.key}
                  onClick={() => setPriority(p.key)}
                  className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer truncate ${
                    priority === p.key
                      ? p.key === 'Yüksek'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/30'
                        : p.key === 'Orta'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/30'
                        : 'bg-slate-700 text-white border-slate-700 shadow-sm shadow-slate-700/30'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                      priority === p.key
                        ? 'bg-white'
                        : p.key === 'Yüksek'
                        ? 'bg-rose-500'
                        : p.key === 'Orta'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tarihler */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Planlanan Gün */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-1.5 sm:space-y-2">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>{t.modalScheduledDateLabel}</span>
              </label>

              <div className="flex items-center gap-1 mb-1">
                <button
                  type="button"
                  onClick={() => setScheduledDate(getDateOffset(0))}
                  className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer ${
                    scheduledDate === getDateOffset(0)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {t.dateToday}
                </button>
                <button
                  type="button"
                  onClick={() => setScheduledDate(getDateOffset(1))}
                  className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer ${
                    scheduledDate === getDateOffset(1)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {t.dateTomorrow}
                </button>
              </div>

              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {t.modalScheduledDateHint}
              </p>
            </div>

            {/* Son Teslim Tarihi */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5 sm:space-y-2">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>{t.modalDueDateLabel}</span>
              </label>

              <div className="flex items-center gap-1 mb-1">
                <button
                  type="button"
                  onClick={() => setDueDate(getDateOffset(0))}
                  className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {t.dateToday}
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getDateOffset(3))}
                  className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {t.datePlus3Days}
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getDateOffset(7))}
                  className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {t.datePlus1Week}
                </button>
              </div>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {t.modalDueDateHint}
              </p>
            </div>
          </div>

          {/* Alt Görevler */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 sm:mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === 'tr' ? 'Alt Görevler' : 'Subtasks'}</span>
            </label>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 mb-2.5">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-medium break-all pr-2">
                      • {sub.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder={language === 'tr' ? 'Yeni alt adım yazın (Enter veya Ekle)' : 'Type subtask and press Enter'}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-xl border border-indigo-200 dark:border-indigo-800 cursor-pointer flex-shrink-0"
              >
                + {language === 'tr' ? 'Ekle' : 'Add'}
              </button>
            </div>
          </div>

          {/* Notlar */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 sm:mb-2">
              {t.modalNotesLabel}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder={t.modalNotesPlaceholder}
              className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Butonlar */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t.modalCancelBtn}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{taskToEdit ? t.modalSaveBtn : t.modalAddBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
