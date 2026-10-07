import React, { useRef, useState } from 'react';
import { X, Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, HardDrive } from 'lucide-react';
import type { Task, PomodoroSettings, PomodoroSessionRecord, PlannerBackupData } from '../interfaces';
import type { Language } from '../i18n/translations';
import { exportBackupJSON, exportTasksCSV, importBackupJSON } from '../utils/backup';
import { triggerConfetti } from '../utils/confetti';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  pomodoroSessions: PomodoroSessionRecord[];
  pomodoroSettings: PomodoroSettings;
  theme: 'light' | 'dark';
  language: Language;
  onRestoreBackup: (data: PlannerBackupData) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  tasks,
  pomodoroSessions,
  pomodoroSettings,
  theme,
  language,
  onRestoreBackup,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    exportBackupJSON(tasks, pomodoroSessions, pomodoroSettings, theme, language);
    setStatusMessage({
      text: language === 'tr' ? 'Yedek dosyası (JSON) başarıyla indirildi.' : 'Backup file (JSON) downloaded successfully.',
      isError: false,
    });
  };

  const handleExportCSV = () => {
    exportTasksCSV(tasks, language);
    setStatusMessage({
      text: language === 'tr' ? 'Görevler (CSV) tablosu başarıyla indirildi.' : 'Tasks table (CSV) downloaded successfully.',
      isError: false,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importBackupJSON(file);
      onRestoreBackup(data);
      triggerConfetti('small');
      setStatusMessage({
        text:
          language === 'tr'
            ? `Yedekleme başarıyla yüklendi! (${data.tasks.length} görev)`
            : `Backup restored successfully! (${data.tasks.length} tasks)`,
        isError: false,
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setStatusMessage({
        text:
          language === 'tr'
            ? 'Geçersiz dosya formatı. Lütfen geçerli bir Planner JSON yedek dosyası seçin.'
            : 'Invalid file format. Please select a valid Planner JSON backup file.',
        isError: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'tr' ? 'Veri Yedekleme & Aktarma' : 'Data Backup & Transfer'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* İçerik */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {language === 'tr'
              ? 'Tüm görevlerinizi, tamamlanan çalışma oturumlarınızı ve ayarlarınızı bilgisayarınıza indirebilir veya başka bir cihazdan geri yükleyebilirsiniz.'
              : 'You can download all your tasks, completed focus sessions, and settings to your computer, or restore them from another device.'}
          </p>

          {statusMessage && (
            <div
              className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-semibold ${
                statusMessage.isError
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
              }`}
            >
              {statusMessage.isError ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Dışa Aktarma Butonları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'tr' ? 'Yedek İndir (JSON)' : 'Download Backup (JSON)'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{language === 'tr' ? 'Tablo İndir (CSV)' : 'Export Table (CSV)'}</span>
            </button>
          </div>

          {/* İçe Aktarma / Geri Yükleme Bölümü */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-dashed border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4 text-indigo-500" />
              <span>{language === 'tr' ? 'Yedek Yükle / Geri Getir (.json)' : 'Upload / Restore Backup (.json)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
