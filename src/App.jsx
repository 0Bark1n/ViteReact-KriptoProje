import React, { useState, useEffect } from 'react';
import './styles/main.scss';

// Lokal Montserrat Font Ağırlıkları
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';

// Lokal FontAwesome İkonları
import '@fortawesome/fontawesome-free/css/all.min.css';

// Oluşturduğumuz Bileşenler
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import DashboardPanel from './components/DashboardPanel';
import RealApiPanel from './components/RealApiPanel';
import CurrencyPanel from './components/CurrencyPanel';
import SettingsPanel from './components/SettingsPanel';
import ContributorsPanel from './components/ContributorsPanel';
import AssetsPanel from './components/AssetsPanel';
import HistoryPanel from './components/HistoryPanel';

import Footer from './components/Footer';

function App() {
  // BÜTÜN USESTATE'LER BURADA, FONKSİYONUN İÇİNDE OLMALI!
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard-content');
  const [toasts, setToasts] = useState([]); // Sağ üstten çıkan bildirimler için

  // Tema Değişimi
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Sağ üstten fırlayan bildirimleri (Toast) yakalayan dinleyici
  useEffect(() => {
    const handleToast = (e) => {
      const { message, type } = e.detail;
      const newToast = { id: Date.now(), message, type };
      
      setToasts(prev => [...prev, newToast]);

      // 3 saniye sonra ekrandan sil
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener('trigger-notification', handleToast);
    return () => window.removeEventListener('trigger-notification', handleToast);
  }, []);

  // Sekme Yönlendirmesi
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard-content': return <DashboardPanel />;
      case 'real-api-panel': return <RealApiPanel />;
      case 'currency-panel': return <CurrencyPanel />;
      case 'settings-panel': return <SettingsPanel />;
      case 'contributors-panel': return <ContributorsPanel />;
      case 'assets-panel': return <AssetsPanel />;
      case 'history-panel': return <HistoryPanel />;

      default: return <DashboardPanel />;
    }
  };

  return (
    <>
      {/* Üst Menü */}
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Ana Dashboard Alanı */}
      <main className="dashboard">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <section className="content">
          {renderContent()}
        </section>
      </main>

      {/* Toast Bildirim Alanı (HTML'in en altında duran div'in React versiyonu) */}
      <div id="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type === 'error' ? 'error' : ''}`}>
            {toast.message}
          </div>
        ))}
      </div>

      {/* Alt Bilgi */}
      <Footer />
    </>
  );
}

export default App;