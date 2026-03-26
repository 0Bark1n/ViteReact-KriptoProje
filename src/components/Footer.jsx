import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        
        <div className="footer-section about">
          <h2 className="logo">KRİPTO<span>PROJE</span></h2>
          <p>Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi | Bilişim Teknolojileri Meslek Yüksekokulu | Yazılım, Uygulama Geliştirme ve Çözümleme Bölümü | Ön-Yüz Yazılım Geliştirme</p>
          <div className="social-icons">
            <a href="https://0bark1n.github.io/OkulProjesi_Kripto/" aria-label="Siteyi yenile"><i className="fab fa-weebly"></i></a>
            <a href="https://github.com/0Bark1n/OkulProjesi_Kripto" aria-label="GitHub Hesabına Git" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
          </div>
        </div>

        <div className="footer-section links">
          <h3>Hızlı Erişim</h3>
          <ul>
            <li><a href="#dashboard" data-target="dashboard-content">Dashboard</a></li>
            <li><a href="#assets" data-target="assets-panel">Varlıklarım</a></li>
            <li><a href="#history" data-target="history-panel">İşlem Geçmişi</a></li>
            <li><a href="#settings" data-target="settings-panel">Ayarlar</a></li>
            <li><a href="#contributors" data-target="contributors-panel">Emeği Geçenler</a></li>
          </ul>
        </div>
        
      </div>

      <div className="footer-bottom">
        <p>-[[ Grup No 2 | Proje Konusu: Dijital Finans ve Kripto Cüzdan Arayüzü ]]-</p>
      </div>
    </footer>
  );
};

export default Footer;