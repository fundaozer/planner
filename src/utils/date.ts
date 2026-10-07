import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isToday = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  return dateStr === getTodayDateString();
};

export const isOverdue = (dueDateStr?: string, completed: boolean = false): boolean => {
  if (!dueDateStr || completed) return false;
  const todayStr = getTodayDateString();
  return dueDateStr < todayStr;
};

export const formatDisplayDate = (
  dateStr?: string,
  lang: Language = 'tr'
): { label: string; isPast: boolean; isCurrentDay: boolean } => {
  const t = translations[lang];
  if (!dateStr) return { label: t.dateNoDate, isPast: false, isCurrentDay: false };

  const todayStr = getTodayDateString();
  const isCurrentDay = dateStr === todayStr;
  const isPast = dateStr < todayStr;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (isCurrentDay) {
    return { label: t.dateToday, isPast: false, isCurrentDay: true };
  } else if (dateStr === tomorrowStr) {
    return { label: t.dateTomorrow, isPast: false, isCurrentDay: false };
  } else if (dateStr === yesterdayStr) {
    return { label: t.dateYesterday, isPast: true, isCurrentDay: false };
  }

  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
    const formatted = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: dateObj.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    }).format(dateObj);

    return { label: formatted, isPast, isCurrentDay };
  } catch {
    return { label: dateStr, isPast, isCurrentDay };
  }
};

export const isThisWeek = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  const now = new Date();
  const currentDay = now.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const target = new Date(dateStr);
  return target >= monday && target <= sunday;
};
