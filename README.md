# 🚀 KriptoProje: Dijital Finans ve Kripto Cüzdan Arayüzü

![ATÜ Logo](https://github.com/0Bark1n/OkulProjesi_Kripto/blob/main/assets/ATU_Logo.jpg)

**Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi (ATÜ)**, Ön-Yüz Yazılım Geliştirme bölümü *İleri Web Tasarımı* dersi kapsamında, **Grup No 2** tarafından geliştirilmiş kapsamlı bir borsa ve cüzdan simülasyonu projesidir.

---

## 💎 Proje Hakkında Genel Bakış

Bu uygulama, modern kripto para borsalarının sunduğu kullanıcı deneyimini (UX) ve arayüz dinamiklerini (UI) simüle eder. Kullanıcılara gerçek zamanlı piyasa verilerini izleme, varlık yönetimi ve işlem geçmişi gibi modülleri yüksek performanslı bir arayüzle sunar.

### ✨ Öne Çıkan Özellikler
* **Dinamik Portföy Takibi:** Kullanıcı varlıklarının ve anlık değer değişimlerinin görselleştirilmesi.
* **Piyasa Verileri:** Kripto varlıkların canlı fiyat takibi ve yüzdece değişim grafiklerinin simülasyonu.
* **Responsive Mimari:** Mobil, tablet ve masaüstü cihazlar için tam uyumlu (Mobile-First) tasarım.
* **Dark Mode Native:** Göz yormayan, finans uygulamalarına uygun koyu tema mimarisi.

---

## 🛠️ Teknik Yığın (Tech Stack)

### **Frontend & Framework**
* **React + Vite:** Hızlı HMR (Hot Module Replacement) ve optimize edilmiş build süreçleri için tercih edildi.
* **SCSS (Sass):** Karmaşık stil hiyerarşilerini yönetmek, değişkenler (variables) ve mixin'ler kullanarak daha sürdürülebilir bir CSS mimarisi oluşturmak için kullanıldı.
* **React-Router-Dom:** Sayfalar arası akıcı ve SPA (Single Page Application) deneyimi için entegre edildi.

### **Mimari ve Performans Optimizasyonu**
Lighthouse raporlarındaki **Kritik İstek Zinciri** hatalarını gidermek için şu ileri düzey teknikler uygulandı:
* **Asset Splitting:** `ManualChunks` ile kütüphane kodları (Vendor) ve uygulama kodları ayrıştırıldı.
* **Bundle Optimization:** `Terser` mimarisiyle JS dosyaları en üst seviyede sıkıştırıldı.
* **CSS Injection:** Küçük boyutlu stil dosyaları, ağ isteğini (HTTP request) azaltmak adına JS içine gömüldü (Inline CSS).
* **Preload & Swap:** Font ve kritik varlıklar için `preload` ve `font-display: swap` stratejileriyle LCP (Largest Contentful Paint) süresi optimize edildi.

### **SEO (Arama Motoru Optimizasyonu)**
Proje, arama motorlarında üst sıralarda yer alması için şu SEO standartlarına sahiptir:
* **Semantic HTML:** `header`, `main`, `section`, `nav` gibi anlamlı etiketlerle yapılandırıldı.
* **Meta Tags:** Dinamik sayfa başlıkları, açıklamalar ve anahtar kelimeler optimize edildi.
* **Open Graph (OG):** Sosyal medya paylaşımlarında projenin görsel ve açıklama ile zengin görünmesi sağlandı.
* **Canonical Link:** Yinelenen içerik sorununu önlemek için standart URL yapıları kuruldu.

---

## 📉 Performans Analizi (Lighthouse)

Yapılan optimizasyon çalışmaları sonucunda projede ciddi bir performans sıçraması yaşanmıştır:
* **Önce:** ~1050ms Kritik Yol Gecikmesi
* **Sonra:** ~450ms Kritik Yol Gecikmesi
* **İyileşme Oranı:** %55'in üzerinde hız artışı sağlandı.

---

## 📦 Kurulum ve Çalıştırma

1. Depoyu klonlayın:
   ```bash
   git clone [https://github.com/0Bark1n/ViteReact-KriptoProje.git](https://github.com/0Bark1n/ViteReact-KriptoProje.git)
