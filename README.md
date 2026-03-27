# 📈 CTRL Crypto & Metals Portfolio Dashboard

Modern, yüksek performanslı ve tam duyarlı (responsive) bir Dijital Varlık ve Portföy Yönetim Simülasyonu. Bu proje, kullanıcıların kripto paralar ve değerli madenler üzerinden yatırımlarını yönetebileceği, gerçek piyasa verilerini ve gelişmiş UI/UX dinamiklerini barındıran kapsamlı bir Front-End uygulamasıdır.

## 🚀 Proje Vizyonu ve Mimari Yaklaşım

Bu proje sadece statik bir arayüz değil; **Component Reusability (Bileşen Yeniden Kullanılabilirliği)** ve **State Management (Durum Yönetimi)** prensiplerinin uç noktada kullanıldığı bir mühendislik örneğidir. 

Aynı arayüz bileşenleri (`DashboardPanel`, `RealApiPanel`) kendilerine gönderilen `props` değerlerine göre ("crypto" veya "metals") tamamen farklı veri setleri, grafikler ve renk şemaları ile çalışacak şekilde akıllı hale getirilmiştir.

## ✨ Temel Özellikler

* **Çift Modlu Yatırım Paneli:** Kripto (BTC, ETH) ve Değerli Madenler (XAU, XAG) için özelleştirilmiş alım/satım simülasyonları.
* **Ortak Cüzdan Mimarisi (Single Source of Truth):** Tüm işlemler ortak bir banka bakiyesinden (`localStorage`) yönetilir. 
* **Gerçek & Simüle Piyasalar:**
  * *Kripto:* Binance REST API üzerinden canlı kline (mum) verisi çekimi.
  * *Maden:* Gerçekçi volatilite algoritmaları ile tarihsel ve canlı veri simülasyonu (Random Walk Algorithm).
* **Dinamik Tema Motoru (Dark/Light):** CSS Değişkenleri (`var(--)`) kullanılarak yazılmış, açık temada *Altın (Gold)* vurgulara sahip akıllı tema geçişi.
* **Bildirim Sistemi (Toast):** Özelleştirilmiş Custom Event fırlatıcıları ile sistem genelinde asenkron hata ve başarı bildirimleri.
* **Kalıcı Veri (Persistence):** İşlem geçmişi, varlık dağılımları ve kullanıcı tercihleri `localStorage` ile tarayıcıda tutulur.

## 🛠 Kullanılan Teknolojiler & Kütüphaneler

| Teknoloji | Kullanım Amacı |
| :--- | :--- |
| **React.js** | Kullanıcı arayüzü ve Component mimarisi |
| **SCSS (Sass)** | Modüler, değişken tabanlı ve yönetilebilir stil mimarisi |
| **ApexCharts** | İnteraktif Area ve Donut (Dominasyon) grafikleri |
| **React Suspense & Lazy** | Ağır bileşenlerin ve grafiklerin sonradan yüklenmesi (Code Splitting) |
| **FontAwesome** | Vektörel ikon setleri |
| **Fetch API** | Binance üzerinden asenkron veri çekimi |

## ❌ Kullanılmayanlar (Bilinçli Tercihler)

* **Redux / Context API:** Proje ölçeği `localStorage` ve React State ile yönetilebilecek seviyede tutularak gereksiz "Over-engineering" (aşırı mühendislik) engellendi.
* **Bootstrap / Tailwind:** CSS yeteneklerini ve SCSS modülerliğini tam anlamıyla sergilemek adına hiçbir hazır stil kütüphanesi (framework) kullanılmadı. Her şey sıfırdan (`from scratch`) kodlandı.
* **Ağır Resim Dosyaları:** İkonlar ve logolar (BTC, ETH vb.) inline SVG veya ikon fontları olarak kullanılarak HTTP istekleri minimize edildi.

## Lighthouse Raporu
EKLENECEK