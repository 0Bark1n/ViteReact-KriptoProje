import React, { useState, useEffect, Suspense, lazy } from 'react';
import './styles/main.scss';

// Lokal FontAwesome İkonları
import '@fortawesome/fontawesome-free/css/all.min.css';

// Sabit yüklenmesi gereken ana iskelet bileşenleri
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Tıklanınca (Lazy) yüklenecek olan ağır paneller
const DashboardPanel = lazy(() => import('./components/DashboardPanel'));
const RealApiPanel = lazy(() => import('./components/RealApiPanel'));
const CurrencyPanel = lazy(() => import('./components/CurrencyPanel'));
const AssetsPanel = lazy(() => import('./components/AssetsPanel'));
const HistoryPanel = lazy(() => import('./components/HistoryPanel'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));
const ContributorsPanel = lazy(() => import('./components/ContributorsPanel'));

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

  // Sekme Yönlendirmesi (Lazy Load ile Optimize Edilmiş)
  const renderContent = () => {
    let ContentComponent;

    switch (activeTab) {
      case 'dashboard-content': ContentComponent = <DashboardPanel />; break;
      case 'real-api-panel': ContentComponent = <RealApiPanel />; break;
      case 'currency-panel': ContentComponent = <CurrencyPanel />; break;
      case 'assets-panel': ContentComponent = <AssetsPanel />; break;
      case 'history-panel': ContentComponent = <HistoryPanel />; break;
      case 'settings-panel': ContentComponent = <SettingsPanel />; break;
      case 'contributors-panel': ContentComponent = <ContributorsPanel />; break;
      default: ContentComponent = <DashboardPanel />;
    }

    return (
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#a5b4fc', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Panel Yükleniyor...
        </div>
      }>
        {ContentComponent}
      </Suspense>
    );
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