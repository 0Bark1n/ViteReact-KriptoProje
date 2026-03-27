<div align="center">

<img src="./src/assets/ATU_Logo.jpg" width="150" alt="ATÜ Logo">

# 📊 CTRL Crypto & Metals Dashboard
### Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi
**Ön-Yüz Yazılım Geliştirme Projesi**

<br>
<a href="https://vite-react-kripto-proje.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/PROJENİN_CANLI_DEMOSU-TIKLA_İZLE-success?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
</a>
<p>🔗 <b>Link:</b> <a href="https://vite-react-kripto-proje.vercel.app/">https://vite-react-kripto-proje.vercel.app/</a></p>
<br>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://javascript.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br>

<img src="./src/assets/Logo.png" width="150" alt="CTRL Crypto Logo">

</div>

---

## 📋 Proje Gereksinimleri & Uygulama Durumu

Hoca tarafından belirtilen tüm teknik şartlar projede eksiksiz bir şekilde uygulanmıştır:

- [x] **Responsive (Duyarlı) Tasarım:** Mobil, tablet ve masaüstü cihazlar için tam uyumlu `flexbox` ve `grid` yapısı.
- [x] **Semantik Yapı:** Sayfa mimarisi `<header>`, `<main>` ve `<footer>` bölümleri üzerine kurgulanmıştır.
- [x] **Grid Sistemi:** Sayfa yerleşimi modern CSS Grid sistemi kullanılarak, hiçbir dış framework (Bootstrap/Tailwind) bağımlılığı olmadan %100 özgün kodlanmıştır.
- [x] **Animasyon & Geçiş Efektleri:** Dashboard geçişleri, portföy kartlarındaki hover efektleri ve toast bildirimleri için gelişmiş CSS Keyframes ve JS destekli animasyonlar kullanılmıştır.
- [x] **SEO Optimizasyonu:** `index.html` üzerinde Open Graph (OG) etiketleri, meta açıklamaları ve canonical linkler yapılandırılmıştır.
- [x] **Cross-Browser Uyumluluğu:** Chrome, Firefox, Safari ve Edge tarayıcılarında test edilerek stabilite sağlanmıştır.
- [x] **Tema Modu:** Dinamik "Dark/Light Mode" özelliği. Aydınlık modda logodaki altın detaylarına uygun olarak *Primary Accent* rengi altın sarısına dönüşmektedir.
- [x] **Performans Analizi:** Google Lighthouse üzerinden 4 kategoride ortalama **92/100** puan alınmıştır.

---

## 🛠️ Teknik Detaylar ve Mimari

Bu proje, yüksek performanslı bir kullanıcı deneyimi sunmak amacıyla **Vite** altyapısı ile geliştirilmiştir. Projede kullanılan ileri düzey teknikler:

* **Code Splitting:** Ağır grafik kütüphaneleri (ApexCharts) `React.lazy` ve `Suspense` ile bölünerek sitenin ilk açılış hızı (FCP) minimize edilmiştir.
* **Asset Optimization:** Logolar ve ikonlar yüksek öncelikli (`fetchpriority="high"`) olarak işaretlenmiş, render-blocking kaynaklar (fontlar, ikon setleri) asenkron hale getirilmiştir.
* **Vercel Caching:** `vercel.json` üzerinden statik varlıklar için 1 yıllık önbellekleme politikası (Efficient Cache Policy) uygulanmıştır.

---

## 📈 Performans Raporu (Lighthouse Audit)

Proje, modern web standartlarının en üst seviyesinde performans sunmaktadır. Aşağıdaki skorlar **Vercel Deployment** üzerinden alınan gerçek sonuçlardır.

<div align="center">

<table width="90%" border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; text-align: center; border: 2px solid #4f46e5;">
  <thead>
    <tr style="background-color: #4f46e5; color: white;">
      <th>Performans</th>
      <th>Erişilebilirlik</th>
      <th>En İyi Uygulamalar</th>
      <th>SEO</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><h2 style="color: #0cce6b;">💯 94</h2></td>
      <td><h2 style="color: #0cce6b;">💯 90</h2></td>
      <td><h2 style="color: #0cce6b;">💯 92</h2></td>
      <td><h2 style="color: #0cce6b;">💯 100</h2></td>
    </tr>
  </tbody>
</table>

<br>
<p><i>Detaylı performans raporuna proje içerisindeki /public/<b>LighthouseRaporu.html</b> dosyasından veya web arayüzündeki footerda bulunan yazıya tıklayarak ulaşabilirsiniz.</i></p>

</div>

---