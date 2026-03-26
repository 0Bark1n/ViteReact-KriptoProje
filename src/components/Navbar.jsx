import React, { useState, useEffect } from 'react';
import notifSound from '../assets/notif.mp3';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem('user_notifs')) || []);

  // Orijinal projedeki gibi her yerden bildirim almak için CustomEvent dinleyici
  useEffect(() => {
    const handleNewNotif = (e) => {
      const { message } = e.detail;
      const now = new Date();
      const time = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      const notifText = `[${time}] ${message}`;

      // Bildirim Sesini Çal (Eğer ayarlardan kapatılmadıysa)
      const isSoundEnabled = localStorage.getItem('notif_enabled');
      if (isSoundEnabled !== 'false') {
        const audio = new Audio(notifSound);
        audio.volume = 0.5;
        audio.play().catch(err => console.log("Otomatik ses engellendi:", err));
      }

      setNotifications(prev => {
        const newArray = [notifText, ...prev].slice(0, 10); // Son 10 bildirimi tut
        localStorage.setItem('user_notifs', JSON.stringify(newArray));
        return newArray;
      });
    };

    window.addEventListener('trigger-notification', handleNewNotif);
    return () => window.removeEventListener('trigger-notification', handleNewNotif);
  }, []);

  // Menü dışına tıklanınca bildirim panelini kapat
  useEffect(() => {
    const closePanel = (e) => {
      if (!e.target.closest('.notification-wrapper')) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('click', closePanel);
    return () => document.removeEventListener('click', closePanel);
  }, []);

  const clearNotifs = (e) => {
    e.stopPropagation();
    setNotifications([]);
    localStorage.removeItem('user_notifs');
  };

  return (
    <header className="header">
      <nav className="nav-container">
      <div className="logo" aria-label="KriptoPROJE Logo">
          {/* SVG Logo: Artık font beklemeye gerek yok! */}
          <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo_grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#a5b4fc" />
              </linearGradient>
            </defs>
            {/* İkon: 'K' harfi sembolü */}
            <rect x="0" y="5" width="10" height="30" rx="3" fill="url(#logo_grad)" />
            <path d="M10 20L22 8M10 20L22 32" stroke="url(#logo_grad)" strokeWidth="4" strokeLinecap="round" />
            {/* Metin kısmı SVG Path olarak: Font bağımlılığı SIFIR */}
          </svg>
        </div>
        
        <div className="header-actions">
          <div className="notification-wrapper">
            <button id="notif-btn" className="action-btn" aria-label="Bildirimleri Aç" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <i className="fas fa-bell"></i>
              {notifications.length > 0 && <span id="notif-badge"></span>}
            </button>
            
            {/* Bildirim Paneli */}
            <div id="notif-panel" className={`notif-panel ${isNotifOpen ? 'active' : ''}`}>
              <h3>Bildirim Geçmişi</h3>
              <div id="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-item" style={{ opacity: 0.5, textAlign: 'center' }}>Bildirim bulunmuyor.</div>
                ) : (
                  notifications.map((n, i) => <div key={i} className="notif-item">{n}</div>)
                )}
              </div>
              <button id="clear-notifs" onClick={clearNotifs}>Temizle</button>
            </div>
          </div>
          
          <button id="theme-toggle" className="action-btn" aria-label="Temayı Değiştir" onClick={() => setIsDarkMode(!isDarkMode)}>
            <i className={isDarkMode ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;