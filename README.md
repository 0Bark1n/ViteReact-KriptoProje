<div align="center">
  <img src="./src/assets/Logo.png" alt="KriptoProje Logo" height="70" />
  
  <br />
  <br />

  <img src="./src/assets/ATU_Logo.jpg" alt="ATÜ Logo" height="100" />

  <h1>📈 KriptoProje - React Tabanlı Dijital Finans Arayüzü</h1>

  <p>
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/SCSS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white" alt="SCSS" />
    <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />
  </p>
</div>

Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi (ATÜ), **Ön Yüz Yazılım Geliştirme** bölümü, **İleri Web Tasarımı** dersi kapsamında geliştirilmiş; modern, yüksek performanslı ve modüler yapıya sahip bir kripto borsa terminali projesidir.

🌐 **Canlı Demo:** [Projeyi Görüntüle](https://vite-react-kripto-proje.vercel.app/)

---

## 🚀 Öne Çıkan Özellikler

Bu proje, modern Front-End teknolojileri (React & Vite) kullanılarak "Bileşen Tabanlı" (Component-based) bir mimari ile sıfırdan inşa edilmiştir.

* **Modüler React Bileşenleri (Components):** Uygulama `DashboardPanel`, `AssetsPanel`, `CurrencyPanel` gibi birbirinden bağımsız, yeniden kullanılabilir ve state-driven (durum yönetimli) bileşenlere ayrılmıştır.
* **Gelişmiş Performans Optimizasyonu:** Lighthouse skoru maksimize edilmiş; Vite config üzerinden `Terser` ile kod küçültme, `ManualChunks` ile Vendor/App ayrımı ve Preload stratejileri uygulanarak "Kritik Yol Gecikmesi" (Critical Request Chain) minimize edilmiştir.
* **Dinamik Veri Akışı:** Gerçek piyasa dinamiklerini simüle eden, anlık güncellenen kripto para fiyatları ve cüzdan bakiyesi hesaplamaları (`RealApiPanel`).
* **Karanlık Tema (Dark Mode) Mimarisi:** SCSS `_variables.scss` modülü üzerinden CSS Variable'lar kullanılarak sisteme entegre edilmiş, tüm bileşenlere duyarlı tema motoru.
* **Responsive & Interaktif UI:** Mobil öncelikli (Mobile-First) tasarlanmış açılır-kapanır `Sidebar` navigasyonu, dinamik `Navbar` ve bildirim (Notification) sistemi.
* **Modüler SCSS Mimarisi (7-1 Pattern):** CSS kodları `_layout.scss`, `_components.scss`, `_variables.scss` gibi modüllere ayrılarak derlenmiş, temiz kod (Clean Code) prensiplerine uyulmuştur.
* **Kusursuz SEO & Meta Optimizasyonu:** Open Graph (OG), Semantic HTML ve arama motoru botları için gerekli tüm meta etiketleme (metadata) yapılmıştır.

---

## 🛠️ Kullanılan Teknolojiler

* **Framework & Build Tool:** React.js, Vite
* **Markup & Stil:** HTML5 (Semantic), CSS3, SCSS (Sass Preprocessor)
* **Programlama Dili:** JavaScript (ES6+ / JSX)
* **Görsel & Ses:** FontAwesome (İkonlar), Google Fonts (Montserrat), HTML5 Audio API (Bildirim Sesleri)
* **Dağıtım (Deployment):** Vercel (CI/CD Entegrasyonlu)

---

## 📁 Proje Dizin Yapısı

```text
📦 src
 ┣ 📂 assets/              # Statik dosyalar (İkonlar, Resimler, Sesler)
 ┃ ┣ 📜 ATU_Logo.jpg
 ┃ ┣ 📜 notif.mp3          # Bildirim sesi
 ┃ ┗ 📜 ... (diğer görseller)
 ┣ 📂 components/          # Bağımsız React Bileşenleri
 ┃ ┣ 📜 AssetsPanel.jsx    # Cüzdan ve varlık dağılımı
 ┃ ┣ 📜 ContributorsPanel.jsx # Geliştirici ekibi alanı
 ┃ ┣ 📜 CurrencyPanel.jsx  # Kripto para kurları ve değişimleri
 ┃ ┣ 📜 DashboardPanel.jsx # Ana kontrol paneli
 ┃ ┣ 📜 Footer.jsx
 ┃ ┣ 📜 HistoryPanel.jsx   # İşlem geçmişi tablosu
 ┃ ┣ 📜 Navbar.jsx         # Üst gezinme çubuğu
 ┃ ┣ 📜 RealApiPanel.jsx   # Canlı veri akışı paneli
 ┃ ┣ 📜 SettingsPanel.jsx  # Kullanıcı ve tema ayarları
 ┃ ┗ 📜 Sidebar.jsx        # Sol navigasyon menüsü
 ┣ 📂 styles/              # Parçalanmış (Partial) SCSS modülleri
 ┃ ┣ 📜 _components.scss   # Bileşenlere özel stiller
 ┃ ┣ 📜 _layout.scss       # Grid ve Flexbox yerleşimleri
 ┃ ┣ 📜 _notifications.scss# Bildirim arayüzü stilleri
 ┃ ┣ 📜 _variables.scss    # Renk paleti, fontlar ve temalar
 ┃ ┗ 📜 main.scss          # Tüm SCSS dosyalarını toplayan ana dosya
 ┣ 📜 App.jsx              # Ana bileşen (Component Tree Root)
 ┗ 📜 main.jsx             # React DOM Render (Init) ve Vite giriş noktası