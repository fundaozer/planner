import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings2,
  Volume2,
  VolumeX,
  Target,
  Flame,
  Calendar,
  Sparkles,
  Zap,
  Coffee,
  SunMedium,
  CloudRain,
  Waves,
  Music,
  BarChart3,
  Clock,
} from 'lucide-react';
import type { Task, PomodoroMode, PomodoroSettings, PomodoroSessionRecord, AmbientSoundType } from '../interfaces';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { playNotificationSound } from '../utils/sound';
import { ambientSound } from '../utils/ambientSounds';
import { isToday, isThisWeek } from '../utils/date';
import { triggerConfetti } from '../utils/confetti';

interface PomodoroPageProps {
  tasks: Task[];
  selectedTaskForPomodoro?: Task | null;
  onSelectTaskForPomodoro?: (task: Task | null) => void;
  onPomodoroCompleted: (taskId?: string, durationMinutes?: number) => void;
  sessions: PomodoroSessionRecord[];
  settings: PomodoroSettings;
  onUpdateSettings: (newSettings: PomodoroSettings) => void;
  language: Language;
}

export const PomodoroPage: React.FC<PomodoroPageProps> = ({
  tasks,
  selectedTaskForPomodoro,
  onSelectTaskForPomodoro,
  onPomodoroCompleted,
  sessions,
  settings,
  onUpdateSettings,
  language,
}) => {
  const t = translations[language];
  const pendingTasks = tasks.filter((task) => !task.completed);

  const [mode, setMode] = useState<PomodoroMode>('work');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    selectedTaskForPomodoro ? selectedTaskForPomodoro.id : ''
  );

  const getInitialSeconds = (m: PomodoroMode, s: PomodoroSettings) => {
    switch (m) {
      case 'work':
        return s.workDuration * 60;
      case 'shortBreak':
        return s.shortBreakDuration * 60;
      case 'longBreak':
        return s.longBreakDuration * 60;
    }
  };

  const [timeLeft, setTimeLeft] = useState<number>(getInitialSeconds(mode, settings));
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const [activeAmbient, setActiveAmbient] = useState<AmbientSoundType>(settings.ambientSound || 'none');
  const [ambientVolume, setAmbientVolume] = useState<number>(settings.ambientVolume ?? 0.5);

  const [tempWorkDuration, setTempWorkDuration] = useState(settings.workDuration);
  const [tempShortBreakDuration, setTempShortBreakDuration] = useState(settings.shortBreakDuration);
  const [tempLongBreakDuration, setTempLongBreakDuration] = useState(settings.longBreakDuration);
  const [tempSoundEnabled, setTempSoundEnabled] = useState(settings.soundEnabled);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectedTaskForPomodoro) {
      setSelectedTaskId(selectedTaskForPomodoro.id);
    }
  }, [selectedTaskForPomodoro]);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getInitialSeconds(mode, settings));
    }
  }, [mode, settings]);

  useEffect(() => {
    if (isRunning && activeAmbient !== 'none' && mode === 'work') {
      ambientSound.play(activeAmbient, ambientVolume);
    } else {
      ambientSound.stop();
    }
    return () => {
      ambientSound.stop();
    };
  }, [isRunning, activeAmbient, ambientVolume, mode]);

  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const modeLabel =
      mode === 'work'
        ? t.pomodoroModeWork
        : mode === 'shortBreak'
        ? t.pomodoroModeShortBreak
        : t.pomodoroModeLongBreak;

    if (isRunning) {
      document.title = `(${timeFormatted}) ${modeLabel} | Planner`;
    } else if (timeLeft < getInitialSeconds(mode, settings)) {
      document.title = `(${t.pomodoroBtnPause}) Planner`;
    } else {
      document.title = `${t.appTitle} | ${t.appSubtitle}`;
    }

    return () => {
      document.title = `${t.appTitle} | ${t.appSubtitle}`;
    };
  }, [timeLeft, isRunning, mode, settings, language, t]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedTaskId, settings]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    ambientSound.stop();

    if (settings.soundEnabled) {
      playNotificationSound('complete');
    }

    if (mode === 'work') {
      triggerConfetti('celebrate');
      const duration = settings.workDuration;
      onPomodoroCompleted(selectedTaskId || undefined, duration);
      setMode('shortBreak');
      setTimeLeft(settings.shortBreakDuration * 60);
    } else {
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
    }
  };

  const toggleTimer = () => {
    if (!isRunning && settings.soundEnabled) {
      playNotificationSound('start');
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    ambientSound.stop();
    setTimeLeft(getInitialSeconds(mode, settings));
  };

  const handleModeChange = (newMode: PomodoroMode) => {
    setIsRunning(false);
    ambientSound.stop();
    setMode(newMode);
    setTimeLeft(getInitialSeconds(newMode, settings));
  };

  const handleAmbientChange = (type: AmbientSoundType) => {
    setActiveAmbient(type);
    onUpdateSettings({ ...settings, ambientSound: type });
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    ambientSound.setVolume(vol);
    onUpdateSettings({ ...settings, ambientVolume: vol });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PomodoroSettings = {
      ...settings,
      workDuration: Number(tempWorkDuration),
      shortBreakDuration: Number(tempShortBreakDuration),
      longBreakDuration: Number(tempLongBreakDuration),
      soundEnabled: tempSoundEnabled,
    };
    onUpdateSettings(updated);
    setShowSettingsModal(false);
    if (!isRunning) {
      setTimeLeft(getInitialSeconds(mode, updated));
    }
  };

  const applyPreset = (work: number, shortBreak: number) => {
    const updated: PomodoroSettings = {
      ...settings,
      workDuration: work,
      shortBreakDuration: shortBreak,
    };
    setTempWorkDuration(work);
    setTempShortBreakDuration(shortBreak);
    onUpdateSettings(updated);
    if (!isRunning) {
      setTimeLeft(getInitialSeconds(mode, updated));
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = getInitialSeconds(mode, settings);
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const currentTask = tasks.find((task) => task.id === selectedTaskId);

  // İstatistik hesaplamaları
  const todaySessions = sessions.filter((s) => isToday(s.completedAt) && s.mode === 'work');
  const thisWeekSessions = sessions.filter((s) => isThisWeek(s.completedAt) && s.mode === 'work');
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const thisWeekMinutes = thisWeekSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const completedTasksCount = tasks.filter((task) => task.completed).length;

  // Haftalık gün verileri
  const getWeeklyDaysData = () => {
    const dayNamesTr = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const dayNamesEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const names = language === 'tr' ? dayNamesTr : dayNamesEn;

    const now = new Date();
    const currentDay = now.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);

    return names.map((dayName, index) => {
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + index);
      const targetDateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

      const daySessions = sessions.filter(
        (s) => s.completedAt.startsWith(targetDateStr) && s.mode === 'work'
      );
      const totalDayMinutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
      const isCurrentDay = isToday(targetDateStr);

      return {
        dayName,
        minutes: totalDayMinutes,
        isCurrentDay,
      };
    });
  };

  const weeklyDaysData = getWeeklyDaysData();
  const maxWeeklyMinutes = Math.max(...weeklyDaysData.map((d) => d.minutes), 60);

  const themeColors = {
    work: {
      accent: 'text-rose-500 dark:text-rose-400',
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
      glow: 'shadow-rose-500/15 dark:shadow-rose-500/10',
      bgGlow: 'bg-rose-500/10 dark:bg-rose-500/5',
      border: 'border-rose-200/80 dark:border-rose-900/50',
      btnGradient: 'from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-600/30',
      stroke: '#f43f5e',
    },
    shortBreak: {
      accent: 'text-emerald-500 dark:text-emerald-400',
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      glow: 'shadow-emerald-500/15 dark:shadow-emerald-500/10',
      bgGlow: 'bg-emerald-500/10 dark:bg-emerald-500/5',
      border: 'border-emerald-200/80 dark:border-emerald-900/50',
      btnGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30',
      stroke: '#10b981',
    },
    longBreak: {
      accent: 'text-sky-500 dark:text-sky-400',
      badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-900',
      glow: 'shadow-sky-500/15 dark:shadow-sky-500/10',
      bgGlow: 'bg-sky-500/10 dark:bg-sky-500/5',
      border: 'border-sky-200/80 dark:border-sky-900/50',
      btnGradient: 'from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-600/30',
      stroke: '#0ea5e9',
    },
  }[mode];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-8">
      {/* Sayaç Paneli */}
      <div className={`relative rounded-3xl border bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 transition-all duration-500 shadow-xl ${themeColors.border} ${themeColors.glow}`}>
        <div
          className={`absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-700 ${themeColors.bgGlow}`}
        />
        <div
          className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-700 ${themeColors.bgGlow}`}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Sol Kolon */}
          <div className="lg:col-span-7 flex flex-col items-center text-center space-y-5">
            {/* Mod Seçimi */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
              <button
                type="button"
                onClick={() => handleModeChange('work')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  mode === 'work'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t.pomodoroModeWork} ({settings.workDuration} {language === 'tr' ? 'dk' : 'min'})</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('shortBreak')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  mode === 'shortBreak'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{t.pomodoroModeShortBreak} ({settings.shortBreakDuration} {language === 'tr' ? 'dk' : 'min'})</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('longBreak')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  mode === 'longBreak'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <SunMedium className="w-3.5 h-3.5" />
                <span>{t.pomodoroModeLongBreak} ({settings.longBreakDuration} {language === 'tr' ? 'dk' : 'min'})</span>
              </button>
            </div>

            {/* Dairesel Sayaç */}
            <div className="relative flex items-center justify-center my-1">
              <svg
                className="w-56 h-56 sm:w-64 sm:h-64 -rotate-90 transform drop-shadow-md"
                viewBox="0 0 240 240"
              >
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  className="stroke-slate-200/70 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  stroke={themeColors.stroke}
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 mb-1">
                  {isRunning ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t.pomodoroStatusRunning}</span>
                    </>
                  ) : (
                    <span>{t.pomodoroStatusReady}</span>
                  )}
                </span>

                <div className="text-5xl sm:text-6xl font-black tracking-tight font-mono text-slate-900 dark:text-white">
                  {formattedTime}
                </div>

                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                  {mode === 'work' ? t.pomodoroFocusDurationDesc : t.pomodoroBreakDurationDesc}
                </span>
              </div>
            </div>

            {/* Kontrol Butonları */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetTimer}
                title={t.pomodoroBtnReset}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={toggleTimer}
                className={`flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-base text-white transition-all transform active:scale-95 shadow-lg cursor-pointer bg-gradient-to-r ${themeColors.btnGradient}`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>{t.pomodoroBtnPause}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{t.pomodoroBtnStart}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleTimerComplete}
                title={t.pomodoroBtnSkip}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setTempWorkDuration(settings.workDuration);
                  setTempShortBreakDuration(settings.shortBreakDuration);
                  setTempLongBreakDuration(settings.longBreakDuration);
                  setTempSoundEnabled(settings.soundEnabled);
                  setShowSettingsModal(true);
                }}
                title={t.pomodoroBtnSettings}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sağ Kolon */}
          <div className="lg:col-span-5 space-y-4 text-left">
            
            {/* Görev Seçimi */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-500" />
                  <span>{t.pomodoroFocusingOn}</span>
                </label>
                {currentTask && (
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/50">
                    <Flame className="w-3 h-3" />
                    <span>{currentTask.completedPomodoros || 0} {t.pomodoroCompletedSessionsCount}</span>
                  </span>
                )}
              </div>

              <select
                value={selectedTaskId}
                onChange={(e) => {
                  setSelectedTaskId(e.target.value);
                  const found = tasks.find((task) => task.id === e.target.value);
                  if (onSelectTaskForPomodoro) {
                    onSelectTaskForPomodoro(found || null);
                  }
                }}
                className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
              >
                <option value="">{t.pomodoroGeneralFocus}</option>
                {pendingTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    [{task.category}] {task.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Ortam Sesleri */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-indigo-500" />
                  <span>{language === 'tr' ? 'Ortam Sesleri' : 'Ambient Sounds'}</span>
                </span>
                {activeAmbient !== 'none' && (
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {isRunning ? (language === 'tr' ? '● Çalıyor' : '● Playing') : (language === 'tr' ? 'Başlatılınca çalacak' : 'Plays on start')}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'none', label: language === 'tr' ? 'Kapalı' : 'Off', icon: VolumeX },
                  { id: 'rain', label: language === 'tr' ? 'Yağmur' : 'Rain', icon: CloudRain },
                  { id: 'waves', label: language === 'tr' ? 'Dalga' : 'Waves', icon: Waves },
                  { id: 'fire', label: language === 'tr' ? 'Şömine' : 'Fire', icon: Flame },
                  { id: 'cafe', label: language === 'tr' ? 'Kafe' : 'Cafe', icon: Coffee },
                ].map((snd) => {
                  const SndIcon = snd.icon;
                  const isSelected = activeAmbient === snd.id;
                  return (
                    <button
                      key={snd.id}
                      type="button"
                      onClick={() => handleAmbientChange(snd.id as AmbientSoundType)}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                          : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
                      }`}
                    >
                      <SndIcon className="w-3.5 h-3.5 mb-0.5" />
                      <span>{snd.label}</span>
                    </button>
                  );
                })}
              </div>

              {activeAmbient !== 'none' && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <Volume2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={ambientVolume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}
            </div>

            {/* Hızlı Şablonlar */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                {t.pomodoroQuickPresets}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { label: '25/5 dk', work: 25, break: 5 },
                  { label: '45/10 dk', work: 45, break: 10 },
                  { label: '50/10 dk', work: 50, break: 10 },
                  { label: '60/15 dk', work: 60, break: 15 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.work, preset.break)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      settings.workDuration === preset.work && settings.shortBreakDuration === preset.break
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Günlük Özet */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {language === 'tr' ? 'Bugün Odak' : 'Today Focus'}
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {todayMinutes} {language === 'tr' ? 'dk' : 'min'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {language === 'tr' ? 'Tamamlanan' : 'Sessions'}
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {todaySessions.length} {t.cardSessionsLabel}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* İstatistikler ve Oturum Geçmişi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Haftalık Grafik */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'tr' ? 'Haftalık Odaklanma Dağılımı' : 'Weekly Focus Distribution'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {language === 'tr' ? 'Günlük çalışma süresi performansı' : 'Daily focus duration performance'}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl border border-indigo-200/60 dark:border-indigo-800/60">
              {thisWeekMinutes} {language === 'tr' ? 'dk bu hafta' : 'mins this week'}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-36 pt-4 pb-1 border-b border-slate-100 dark:border-slate-800">
            {weeklyDaysData.map((d, i) => {
              const barHeightPercent = Math.max(10, Math.round((d.minutes / maxWeeklyMinutes) * 100));
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {d.minutes}m
                  </span>
                  <div className="w-full max-w-[32px] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden h-24 flex items-end p-1">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        d.isCurrentDay
                          ? 'bg-gradient-to-t from-indigo-600 to-sky-500 shadow-md shadow-indigo-500/30'
                          : d.minutes > 0
                          ? 'bg-gradient-to-t from-indigo-400 to-indigo-300 dark:from-indigo-700 dark:to-indigo-500'
                          : 'bg-transparent'
                      }`}
                      style={{ height: `${barHeightPercent}%` }}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      d.isCurrentDay
                        ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {d.dayName}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 text-[11px] text-slate-400 font-medium">
            <span>{language === 'tr' ? 'Toplam Tamamlanan Görev:' : 'Total Completed Tasks:'} <strong className="text-slate-800 dark:text-slate-200">{completedTasksCount}</strong></span>
            <span>{language === 'tr' ? 'Haftalık Ortalama:' : 'Weekly Avg:'} <strong className="text-slate-800 dark:text-slate-200">{Math.round(thisWeekMinutes / 7)} {language === 'tr' ? 'dk/gün' : 'm/day'}</strong></span>
          </div>
        </div>

        {/* Son Oturumlar */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.pomodoroRecentSessionsTitle}</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">
              {sessions.length} {language === 'tr' ? 'kayıt' : 'records'}
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-slate-400 space-y-1">
              <Flame className="w-8 h-8 text-slate-300 dark:text-slate-700 stroke-1" />
              <p className="text-xs">{t.pomodoroStatNoSessions}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-56 overflow-y-auto pr-1">
              {sessions.slice(0, 5).map((s) => (
                <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {s.taskTitle || (language === 'tr' ? 'Genel Odaklanma' : 'General Focus')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(s.completedAt).toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        &bull; {new Date(s.completedAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 flex-shrink-0">
                    +{s.durationMinutes} {language === 'tr' ? 'dk' : 'm'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Ayarlar Modalı */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Settings2 className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.settingsModalTitle}
                </h3>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
              <div>
                <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  <span>{t.settingsWorkLabel}</span>
                  <span className="text-sm font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-lg">
                    {tempWorkDuration} {language === 'tr' ? 'dk' : 'min'}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={tempWorkDuration}
                  onChange={(e) => setTempWorkDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  <span>{t.settingsShortBreakLabel}</span>
                  <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg">
                    {tempShortBreakDuration} {language === 'tr' ? 'dk' : 'min'}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={tempShortBreakDuration}
                  onChange={(e) => setTempShortBreakDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  <span>{t.settingsLongBreakLabel}</span>
                  <span className="text-sm font-extrabold text-sky-600 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-lg">
                    {tempLongBreakDuration} {language === 'tr' ? 'dk' : 'min'}
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={tempLongBreakDuration}
                  onChange={(e) => setTempLongBreakDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-500 flex items-center justify-center">
                    {tempSoundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t.settingsSoundTitle}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {t.settingsSoundDesc}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tempSoundEnabled}
                  onChange={(e) => setTempSoundEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {t.modalCancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.settingsSaveBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
