# 🎯 Planner - Görevlerini Planla, Odaklan.

Modern, sade ve kullanıcı dostu arayüze sahip; görev yönetimi ve Pomodoro odaklanma tekniğini bir araya getiren Türkçe & İngilizce web uygulaması.

---

## 🚀 Proje Hakkında ve Temel Özellikler

- **Görev & Alt Görev Yönetimi (Checklist):**
  - Görev ekleme, düzenleme (güncelleme), silme ve tamamlandı olarak işaretleme.
  - Her görev için **Başlık**, **Kategori** (*Ders*, *İş*, *Kişisel*), **Öncelik** (*Düşük*, *Orta*, *Yüksek*).
  - **Alt Görevler (Checklist):** Görevlere özel alt maddeler ekleme, tek tek tamamlama ve ilerleme yüzdesi/çubuğu.
  - **İki Kademeli Tarih Sistemi:**
    - **Hangi Gün Yapılacak? (Planlanan Gün):** Görevi ne zaman yapmayı hedeflediğinizi belirler (*Bugün sekmesinde ve günlük planınızda listelenir*).
    - **Son Teslim Tarihi (Deadline):** Görevin en geç ne zamana kadar bitmesi gerektiğini gösterir (*Günü geçtiğinde kırmızı renkle dikkat çeker*).
- **Akıllı Filtreler:**
  - *Bugün* (Bugün için planlananlar ve gecikenler), *Tümü*, *Tamamlananlar*.
  - Anlık metin arama çubuğu, kategoriye ve önceliğe göre filtreleme.
  - Geciken görevler için dinamik kırmızı uyarı rozetleri.
- **Gelişmiş Pomodoro & Odaklanma Modülü:**
  - İsteğe göre ayarlanabilir odaklanma ve mola süreleri (25/5 dk, 45/10 dk, 50/10 dk, 60/15 dk veya 1-120 dk aralığında özel süre).
  - Modern dairesel SVG animasyonlu sayaç halkası.
  - Sayacı listedeki bir göreve bağlayabilme (*"Şu göreve çalışıyorum"*).
  - Süre bitiminde tarayıcı tabanlı sentezlenmiş hoş sesli bildirim (Web Audio API) ve konfeti kutlaması.
  - Tarayıcı sekme başlığında anlık geri sayım gösterimi (Örn: `(24:45) Odak | Planner`).
- **Doğal Ortam Sesleri (Ambient Sounds):**
  - Web Audio API ile üretilen **Yağmur**, **Okyanus Dalgaları**, **Şömine Ateşi** ve **Kafe** ortam sesleri ile odaklanmayı artırma.
  - Ayarlanabilir ses seviyesi (Volume slider).
- **Verimlilik & Haftalık Aktivite Grafiği:**
  - Bugünün ve bu haftanın toplam çalışma/odaklanma süresi (dakika ve saat bazında).
  - Haftanın günlerine (Pzt - Paz) göre odaklanma sürelerini gösteren görsel aktivite çubuğu grafiği.
  - Tamamlanan odaklanma oturumlarının geçmiş dökümü.
- **Veri Yedekleme & Dışa/İçe Aktarma (JSON & CSV):**
  - Tüm görevleri, odaklanma istatistiklerini ve ayarları tek tıkla **JSON formatında yedekleme**.
  - Microsoft Excel uyumlu (Türkçe karakter destekli) **CSV tablosu olarak indirme**.
  - İndirilen JSON yedeğini dilediğiniz zaman sisteme **Geri Yükleme**.
- **Tasarım, Gizlilik & Çoklu Dil Desteği:**
  - **Türkçe & İngilizce Dil Desteği:** Sağ üstteki `TR` / `EN` butonu ile tüm arayüzü anında iki dilde kullanabilme.
  - Açık (Light) ve Karanlık (Dark) Mod desteği.
  - Mobil, tablet ve masaüstü uyumlu (Responsive).
  - **Backend Gerektirmez:** Tüm veriler kullanıcının kendi tarayıcısındaki **LocalStorage** (Yerel Depolama) alanında tutulur. Başka kullanıcıların verileriyle asla karışmaz ve tamamen kişiye özeldir.

---

## 🛠️ Kullanılan Teknolojiler

- **React 19** & **TypeScript** (Bileşen tabanlı, tip güvenli modern yapı)
- **Vite** (Hızlı geliştirme sunucusu ve optimize edilmiş üretim çıktısı)
- **Tailwind CSS v4** (Modern tasarım sistemi ve koyu tema desteği)
- **Lucide React** (Sade ve zarif modern ikon seti)
- **Web Audio API** (Sentezlenmiş bildirim sesleri ve ortam sesleri)
- **Canvas Confetti** (Kutlama efektleri)
- **HTML5 LocalStorage** (Tarayıcı içi veri kalıcılığı)

---

## 📁 Klasör Yapısı

```
planner/
├── public/
│   ├── _redirects         # Netlify yönlendirme kuralı
│   └── favicon.svg        # Uygulama simgesi
├── src/
│   ├── components/        # Yeniden kullanılabilir arayüz bileşenleri
│   │   ├── BackupModal.tsx       # Veri yedekleme & dışa/içe aktarma modalı
│   │   ├── Navbar.tsx            # Üst bar, dil ve tema kontrolleri
│   │   ├── TaskCard.tsx          # Alt görevli görev kartı
│   │   ├── TaskFilterBar.tsx     # Filtreler, arama ve yeni görev butonu
│   │   ├── TaskModal.tsx         # Görev ve alt görev ekleme/düzenleme penceresi
│   │   └── TaskSummaryStats.tsx  # Metrik özet kartları
│   ├── i18n/              # Çoklu dil (TR / EN) çevirileri
│   │   └── translations.ts
│   ├── interfaces/        # TypeScript modelleri ve tipler
│   │   ├── index.ts
│   │   └── task.ts
│   ├── pages/             # Sayfalar
│   │   ├── TasksPage.tsx         # Görev yönetimi ve listesi
│   │   └── PomodoroPage.tsx      # Pomodoro sayacı, ortam sesleri & haftalık grafik
│   ├── utils/             # Yardımcı araçlar
│   │   ├── ambientSounds.ts      # Web Audio ortam ses motoru
│   │   ├── backup.ts             # JSON/CSV dışa-içe aktarma
│   │   ├── confetti.ts           # Konfeti kutlama motoru
│   │   ├── date.ts               # Dinamik tarih hesaplamaları
│   │   ├── sound.ts              # Web Audio zil bildirimi
│   │   └── storage.ts            # LocalStorage veri yönetimi
│   ├── App.tsx            # Ana uygulama koordinatörü
│   ├── index.css          # Tailwind CSS ve global stiller
│   └── main.tsx           # React giriş noktası
├── netlify.toml           # Netlify konfigürasyonu
└── vite.config.ts         # Vite yapılandırması
```

---

## 💻 Yerel Ortamda Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```

3. Tarayıcınızda açın:
   ```
   http://localhost:5173/
   ```

4. **Üretim (Production) Derlemesi Almak:**
   ```bash
   npm run build
   ```
