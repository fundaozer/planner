export type Language = 'tr' | 'en';

export const translations = {
  tr: {
    // Navbar
    appTitle: 'Planner',
    appSubtitle: 'Görevlerini planla, odaklan.',
    tasksTab: 'Görevler',
    pomodoroTab: 'Pomodoro',
    pendingBadge: 'bekleyen',
    themeDark: 'Karanlık Moda Geç',
    themeLight: 'Açık Moda Geç',
    langSwitch: 'English',

    // İstatistik Kartları (Tasks)
    statsTotal: 'Toplam',
    statsToday: 'Bugün',
    statsCompleted: 'Tamamlanan',
    statsOverdue: 'Geciken',
    statsTasksUnit: 'görev',
    statsPendingUnit: 'bekleyen',
    statsOverdueAlert: 'dikkat!',
    statsOverdueNone: 'yok',

    // Filtre Çubuğu
    filterToday: 'Bugün',
    filterAll: 'Tümü',
    filterCompleted: 'Tamamlananlar',
    addNewTask: 'Yeni Görev Ekle',
    searchPlaceholder: 'Görevlerde ara (başlık, notlar)...',
    categoryLabel: 'Kategori:',
    priorityLabel: 'Öncelik:',
    allOption: 'Tümü',

    // Kategoriler
    catStudy: 'Ders',
    catWork: 'İş',
    catPersonal: 'Kişisel',

    // Öncelikler
    prioHigh: 'Yüksek',
    prioMedium: 'Orta',
    prioLow: 'Düşük',

    // Tarih Terimleri
    dateToday: 'Bugün',
    dateTomorrow: 'Yarın',
    dateYesterday: 'Dün',
    datePlus3Days: '+3 Gün',
    datePlus1Week: '+1 Hafta',
    datePlanPrefix: 'Plan:',
    dateDuePrefix: 'Bitiş:',
    dateOverduePrefix: 'Gecikti',
    dateNoDate: 'Tarih yok',

    // Modal
    modalAddTitle: 'Yeni Görev Ekle',
    modalEditTitle: 'Görevi Düzenle',
    modalTaskTitleLabel: 'Görev Başlığı',
    modalTaskTitlePlaceholder: 'Örn: Algoritma ödevini tamamla',
    modalCategoryLabel: 'Kategori',
    modalPriorityLabel: 'Öncelik',
    modalScheduledDateLabel: 'Hangi Gün Yapılacak?',
    modalScheduledDateHint: 'Bugün sekmesinde ve günlük planınızda görünür.',
    modalDueDateLabel: 'Son Teslim Tarihi',
    modalDueDateHint: 'Gecikirse kırmızı renkle uyarılır.',
    modalNotesLabel: 'Ekstra Notlar',
    modalNotesPlaceholder: 'Görevle ilgili bağlantılar, notlar veya detaylar...',
    modalCancelBtn: 'İptal',
    modalSaveBtn: 'Değişiklikleri Kaydet',
    modalAddBtn: 'Görevi Ekle',
    modalErrorTitle: 'Lütfen görev başlığını girin.',

    // Boş Durumlar (Empty State)
    emptyTodayTitle: 'Bugün için bekleyen görev yok!',
    emptyTodayDesc: 'Harika! Bugün için planlanan tüm işleri bitirdin veya yeni bir görev ekleyebilirsin.',
    emptyCompletedTitle: 'Henüz tamamlanmış görev yok.',
    emptyCompletedDesc: 'Görevlerinizi tamamladıkça burada listelenecektir.',
    emptySearchTitle: 'Aramanızla eşleşen görev bulunamadı.',
    emptyAllTitle: 'Henüz hiç görev eklenmedi.',
    emptyAllDesc: 'Yeni bir görev oluşturarak hedeflerini adım adım gerçekleştirmeye başla.',
    emptyCreateBtn: 'Yeni Görev Oluştur',

    // Görev Kartı Eylemleri
    cardEditTitle: 'Görevi Düzenle',
    cardDeleteTitle: 'Görevi Sil',
    cardFocusTitle: 'Bu göreve odaklan (Pomodoro)',
    cardSessionsLabel: 'oturum',

    // Pomodoro Sayfası
    pomodoroModeWork: 'Odak',
    pomodoroModeShortBreak: 'Kısa Mola',
    pomodoroModeLongBreak: 'Uzun Mola',
    pomodoroStatusRunning: 'Çalışıyor',
    pomodoroStatusReady: 'Hazır',
    pomodoroFocusDurationDesc: 'Odaklanma Süresi',
    pomodoroBreakDurationDesc: 'Dinlenme Molası',
    pomodoroFocusingOn: 'Şu Göreve Odaklanılıyor:',
    pomodoroGeneralFocus: '🎯 Genel Odaklanma (Özel bir görev seçilmedi)',
    pomodoroCompletedSessionsCount: 'oturum',
    pomodoroBtnStart: 'Başlat',
    pomodoroBtnPause: 'Duraklat',
    pomodoroBtnReset: 'Sayacı Sıfırla',
    pomodoroBtnSkip: 'Bu Turu Tamamla / İleri Sar',
    pomodoroBtnSettings: 'Süre ve Bildirim Ayarları',
    pomodoroQuickPresets: 'Hızlı Süre Şablonları',
    pomodoroPresetClassic: '25/5 dk (Standart)',
    pomodoroPresetStudy: '45/10 dk (Ders & Çalışma)',
    pomodoroPresetFocus: '50/10 dk (Odaklanma)',
    pomodoroPresetDeep: '60/15 dk (Derin Çalışma)',

    // Pomodoro İstatistikleri
    pomodoroStatsTitle: 'Çalışma & Odaklanma İstatistikleri',
    pomodoroStatsSubtitle: 'Bugün ve bu haftaki toplam verimlilik performansın',
    pomodoroStatTodayFocus: 'Bugün Odaklanma',
    pomodoroStatWeekTotal: 'Bu Hafta Toplam',
    pomodoroStatCompletedToday: 'Bugün Tamamlanan',
    pomodoroStatFinishedTasks: 'Biten Görevler',
    pomodoroStatMinutes: 'dakika',
    pomodoroStatHoursApprox: 'saat',
    pomodoroStatSessionsCount: 'oturum',
    pomodoroStatNoSessions: 'Henüz oturum yok',
    pomodoroStatCompletedStatus: 'tamamlandı',
    pomodoroRecentSessionsTitle: 'Son Odaklanma Oturumları',
    pomodoroRecentTotalLabel: 'Toplam {count} oturum',

    // Pomodoro Ayarlar Modalı
    settingsModalTitle: 'Pomodoro & Süre Ayarları',
    settingsWorkLabel: 'Odaklanma Süresi (Dakika)',
    settingsShortBreakLabel: 'Kısa Mola Süresi (Dakika)',
    settingsLongBreakLabel: 'Uzun Mola Süresi (Dakika)',
    settingsSoundTitle: 'Sesli Bildirim',
    settingsSoundDesc: 'Süre bittiğinde bildirim sesi çalsın',
    settingsSaveBtn: 'Ayarları Kaydet',

    // Footer
    footerPrivacy: 'Tüm veriler cihazınızın yerel depolama alanında (LocalStorage) kişiye özel saklanır.',
  },
  en: {
    // Navbar
    appTitle: 'Planner',
    appSubtitle: 'Plan your tasks, stay focused.',
    tasksTab: 'Tasks',
    pomodoroTab: 'Pomodoro',
    pendingBadge: 'pending',
    themeDark: 'Switch to Dark Mode',
    themeLight: 'Switch to Light Mode',
    langSwitch: 'Türkçe',

    // İstatistik Kartları (Tasks)
    statsTotal: 'Total',
    statsToday: 'Today',
    statsCompleted: 'Completed',
    statsOverdue: 'Overdue',
    statsTasksUnit: 'tasks',
    statsPendingUnit: 'pending',
    statsOverdueAlert: 'attention!',
    statsOverdueNone: 'none',

    // Filtre Çubuğu
    filterToday: 'Today',
    filterAll: 'All',
    filterCompleted: 'Completed',
    addNewTask: 'Add New Task',
    searchPlaceholder: 'Search tasks (title, notes)...',
    categoryLabel: 'Category:',
    priorityLabel: 'Priority:',
    allOption: 'All',

    // Kategoriler
    catStudy: 'Study',
    catWork: 'Work',
    catPersonal: 'Personal',

    // Öncelikler
    prioHigh: 'High',
    prioMedium: 'Medium',
    prioLow: 'Low',

    // Tarih Terimleri
    dateToday: 'Today',
    dateTomorrow: 'Tomorrow',
    dateYesterday: 'Yesterday',
    datePlus3Days: '+3 Days',
    datePlus1Week: '+1 Week',
    datePlanPrefix: 'Plan:',
    dateDuePrefix: 'Due:',
    dateOverduePrefix: 'Overdue',
    dateNoDate: 'No date',

    // Modal
    modalAddTitle: 'Add New Task',
    modalEditTitle: 'Edit Task',
    modalTaskTitleLabel: 'Task Title',
    modalTaskTitlePlaceholder: 'e.g. Complete Algorithm Homework',
    modalCategoryLabel: 'Category',
    modalPriorityLabel: 'Priority',
    modalScheduledDateLabel: 'When to do?',
    modalScheduledDateHint: 'Shows up in Today tab and your daily plan.',
    modalDueDateLabel: 'Due Date (Deadline)',
    modalDueDateHint: 'Highlighted in red if overdue.',
    modalNotesLabel: 'Extra Notes',
    modalNotesPlaceholder: 'Links, details or notes about the task...',
    modalCancelBtn: 'Cancel',
    modalSaveBtn: 'Save Changes',
    modalAddBtn: 'Add Task',
    modalErrorTitle: 'Please enter a task title.',

    // Boş Durumlar (Empty State)
    emptyTodayTitle: 'No pending tasks for today!',
    emptyTodayDesc: 'Awesome! You finished all plans for today, or you can add a new task.',
    emptyCompletedTitle: 'No completed tasks yet.',
    emptyCompletedDesc: 'Completed tasks will be listed here.',
    emptySearchTitle: 'No tasks found matching your search.',
    emptyAllTitle: 'No tasks added yet.',
    emptyAllDesc: 'Create a new task to start achieving your goals step by step.',
    emptyCreateBtn: 'Create New Task',

    // Görev Kartı Eylemleri
    cardEditTitle: 'Edit Task',
    cardDeleteTitle: 'Delete Task',
    cardFocusTitle: 'Focus on this task (Pomodoro)',
    cardSessionsLabel: 'sessions',

    // Pomodoro Sayfası
    pomodoroModeWork: 'Focus',
    pomodoroModeShortBreak: 'Short Break',
    pomodoroModeLongBreak: 'Long Break',
    pomodoroStatusRunning: 'Running',
    pomodoroStatusReady: 'Ready',
    pomodoroFocusDurationDesc: 'Focus Duration',
    pomodoroBreakDurationDesc: 'Rest Break',
    pomodoroFocusingOn: 'Focusing on Task:',
    pomodoroGeneralFocus: '🎯 General Focus (No specific task selected)',
    pomodoroCompletedSessionsCount: 'sessions',
    pomodoroBtnStart: 'Start',
    pomodoroBtnPause: 'Pause',
    pomodoroBtnReset: 'Reset Timer',
    pomodoroBtnSkip: 'Complete Turn / Skip Forward',
    pomodoroBtnSettings: 'Duration & Sound Settings',
    pomodoroQuickPresets: 'Quick Presets',
    pomodoroPresetClassic: '25/5 min (Standard)',
    pomodoroPresetStudy: '45/10 min (Study & Work)',
    pomodoroPresetFocus: '50/10 min (Focus)',
    pomodoroPresetDeep: '60/15 min (Deep Work)',

    // Pomodoro İstatistikleri
    pomodoroStatsTitle: 'Work & Focus Statistics',
    pomodoroStatsSubtitle: 'Your total productivity performance today and this week',
    pomodoroStatTodayFocus: 'Today Focus',
    pomodoroStatWeekTotal: 'This Week Total',
    pomodoroStatCompletedToday: 'Completed Today',
    pomodoroStatFinishedTasks: 'Finished Tasks',
    pomodoroStatMinutes: 'mins',
    pomodoroStatHoursApprox: 'hours',
    pomodoroStatSessionsCount: 'sessions',
    pomodoroStatNoSessions: 'No sessions yet',
    pomodoroStatCompletedStatus: 'completed',
    pomodoroRecentSessionsTitle: 'Recent Focus Sessions',
    pomodoroRecentTotalLabel: 'Total {count} sessions',

    // Pomodoro Ayarlar Modalı
    settingsModalTitle: 'Pomodoro & Duration Settings',
    settingsWorkLabel: 'Focus Duration (Minutes)',
    settingsShortBreakLabel: 'Short Break Duration (Minutes)',
    settingsLongBreakLabel: 'Long Break Duration (Minutes)',
    settingsSoundTitle: 'Sound Notification',
    settingsSoundDesc: 'Play sound chime when timer ends',
    settingsSaveBtn: 'Save Settings',

    // Footer
    footerPrivacy: 'All data is stored privately on your own device (LocalStorage).',
  },
};
