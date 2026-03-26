import React, { useState } from 'react';

const SettingsPanel = () => {
  // Hafızadan bildirim ayarını çek (Varsayılan olarak true gelsin diye !== 'false' yapıyoruz)
  const [isNotifEnabled, setIsNotifEnabled] = useState(localStorage.getItem('notif_enabled') !== 'false');

  // Bildirim Kapat/Aç Toggle (setup-settings.js mantığı)
  const handleNotifToggle = (e) => {
    const status = e.target.checked;
    setIsNotifEnabled(status);
    localStorage.setItem('notif_enabled', status);
    
    // Eski window.addNotification yerine artık Custom Event fırlatıyoruz
    const msg = status ? "Bildirimler açıldı" : "Bildirimler kapatıldı";
    window.dispatchEvent(new CustomEvent('trigger-notification', { 
      detail: { message: msg, type: "success" } 
    }));
  };

  // Tüm Verileri Sıfırla (setup-settings.js mantığı)
  const handleReset = (e) => {
    e.preventDefault();
    const check = window.confirm("Tüm verileriniz ve ayarlarınız silinecek. Emin misiniz?");
    
    if (check) {
      localStorage.clear();
      
      window.dispatchEvent(new CustomEvent('trigger-notification', { 
        detail: { message: "Veriler sıfırlandı!", type: "error" } 
      }));
      
      // Bildirimin ekranda görünmesi için yarım saniye bekleyip sayfayı yeniliyoruz
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div id="settings-panel" className="settings-panel tab-content">
      <div className="settings-card">
        <h3><i className="fas fa-tools"></i> Sistem Ayarları</h3>
        
        <div className="settings-options">
          <div className="setting-item">
            <span>Bildirim Sesleri</span>
            <input 
              type="checkbox" 
              checked={isNotifEnabled} 
              onChange={handleNotifToggle} 
            />
          </div>
          
          <button id="btn-reset-data" className="btn-reset" onClick={handleReset}>
            Tüm Verileri Sıfırla
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default SettingsPanel;