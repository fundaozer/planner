import React, { useState, useMemo } from 'react';
import type {
  Task,
  FilterType,
  TaskCategory,
  TaskPriority,
} from '../interfaces';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import {
  TaskSummaryStats,
  TaskFilterBar,
  TaskCard,
  TaskModal,
} from '../components';
import { isToday, isOverdue } from '../utils/date';
import { CheckCircle2, ClipboardList, Sparkles } from 'lucide-react';

interface TasksPageProps {
  tasks: Task[];
  onAddTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, taskData: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onStartPomodoroForTask?: (task: Task) => void;
  language: Language;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onToggleSubtask,
  onStartPomodoroForTask,
  language,
}) => {
  const t = translations[language];

  const [filter, setFilter] = useState<FilterType>('bugun');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'All'>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Filtre sayaçları
  const counts = useMemo(() => {
    return {
      bugun: tasks.filter(
        (task) =>
          !task.completed &&
          (isToday(task.scheduledDate) || isToday(task.dueDate) || isOverdue(task.dueDate, task.completed))
      ).length,
      tumu: tasks.length,
      tamamlananlar: tasks.filter((task) => task.completed).length,
    };
  }, [tasks]);

  // Filtrelenmiş ve sıralanmış görevler
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === 'bugun') {
          const isPlanToday = isToday(task.scheduledDate);
          const isDueToday = isToday(task.dueDate);
          const isPastTask = isOverdue(task.dueDate, task.completed);

          if (!task.completed && (isPlanToday || isDueToday || isPastTask)) return true;
          if (task.completed && (isPlanToday || isDueToday)) return true;
          return false;
        }
        if (filter === 'tamamlananlar') {
          return task.completed;
        }
        return true;
      })
      .filter((task) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          (task.notes && task.notes.toLowerCase().includes(query))
        );
      })
      .filter((task) => {
        if (selectedCategory === 'All') return true;
        return task.category === selectedCategory;
      })
      .filter((task) => {
        if (selectedPriority === 'All') return true;
        return task.priority === selectedPriority;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        const aOverdue = isOverdue(a.dueDate, a.completed);
        const bOverdue = isOverdue(b.dueDate, b.completed);
        if (aOverdue !== bOverdue) {
          return aOverdue ? -1 : 1;
        }
        const aDate = a.scheduledDate || a.dueDate || '';
        const bDate = b.scheduledDate || b.dueDate || '';
        return aDate.localeCompare(bDate);
      });
  }, [tasks, filter, searchQuery, selectedCategory, selectedPriority]);

  const handleOpenAddModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleSaveModal = (
    taskData: Omit<Task, 'id' | 'createdAt'>,
    taskId?: string
  ) => {
    if (taskId) {
      onUpdateTask(taskId, taskData);
    } else {
      onAddTask(taskData);
    }
  };

  return (
    <div className="space-y-6">
      {/* İstatistikler */}
      <TaskSummaryStats
        tasks={tasks}
        activeFilter={filter}
        onSelectFilter={(f) => setFilter(f)}
        language={language}
      />

      {/* Filtre ve Arama */}
      <TaskFilterBar
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        onOpenNewTaskModal={handleOpenAddModal}
        counts={counts}
        language={language}
      />

      {/* Görev Listesi */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={handleOpenEditModal}
              onDelete={onDeleteTask}
              onToggleSubtask={onToggleSubtask}
              onStartPomodoroForTask={onStartPomodoroForTask}
              language={language}
            />
          ))}
        </div>
      ) : (
        /* Boş Durum */
        <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-10 md:p-14 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
            {filter === 'tamamlananlar' ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : filter === 'bugun' ? (
              <Sparkles className="w-8 h-8" />
            ) : (
              <ClipboardList className="w-8 h-8" />
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {filter === 'bugun'
              ? t.emptyTodayTitle
              : filter === 'tamamlananlar'
              ? t.emptyCompletedTitle
              : searchQuery
              ? t.emptySearchTitle
              : t.emptyAllTitle}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            {filter === 'bugun'
              ? t.emptyTodayDesc
              : filter === 'tamamlananlar'
              ? t.emptyCompletedDesc
              : t.emptyAllDesc}
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.emptyCreateBtn}</span>
          </button>
        </div>
      )}

      {/* Görev Modalı */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        taskToEdit={taskToEdit}
        language={language}
      />
    </div>
  );
};
