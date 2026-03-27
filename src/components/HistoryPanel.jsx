import React, { useState, useEffect } from 'react';

const HistoryPanel = () => {
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = () => {
    const data = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(data);
  };

  useEffect(() => {
    loadTransactions();
    window.addEventListener('update-history', loadTransactions);
    return () => window.removeEventListener('update-history', loadTransactions);
  }, []);

  // --- SİHİRLİ İKON FONKSİYONU ---
  // İşlem ismine bakıp doğru logoyu ve rengi döndürür
  const getAssetIcon = (assetName) => {
    if (assetName.includes('BTC')) {
      return (
        <svg width="22" height="22" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
          <circle cx="100" cy="100" r="80" fill="#f7931a" />
        </svg>
      );
    }
    if (assetName.includes('ETH')) {
      return (
        <svg width="22" height="22" viewBox="0 0 320 512" style={{ marginRight: '12px' }}>
          <path fill="#627eea" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
        </svg>
      );
    }
    if (assetName.includes('XAU')) {
      return <i className="fas fa-coins" style={{ color: '#dfb63e', fontSize: '1.2rem', marginRight: '12px' }}></i>;
    }
    if (assetName.includes('XAG')) {
      return <i className="fas fa-ring" style={{ color: '#94a3b8', fontSize: '1.2rem', marginRight: '12px' }}></i>;
    }
    // Varsayılan ikon (Eğer başka bir şey alınırsa)
    return <i className="fas fa-money-bill" style={{ color: '#22c55e', fontSize: '1.2rem', marginRight: '12px' }}></i>;
  };

  return (
    <div id="history-panel" className="panel tab-content">
      <div className="history-table">
        <div className="table-header" style={{ marginBottom: '25px' }}>
          <h3>Ortak İşlem Geçmişi</h3>
          <p style={{ opacity: 0.7 }}>Kripto ve Maden portföyünüzdeki tüm alım-satım hareketleri.</p>
        </div>
        
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Varlık</th>
                <th>Tür</th>
                <th>Miktar (USD)</th>
                <th>İşlem Fiyatı</th>
                <th>Tarih</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                    Henüz hiçbir işlem yapmadınız. Borsa veya Madenler sekmesinden alım yapabilirsiniz.
                  </td>
                </tr>
              ) : (
                transactions.map((t, index) => (
                  <tr key={index} className="animate-row">
                    
                    {/* İKON VE İSMİN YAN YANA GÖSTERİLDİĞİ KISIM */}
                    <td style={{ display: 'flex', alignItems: 'center', fontWeight: '800' }}>
                      {getAssetIcon(t.asset)}
                      {t.asset}
                    </td>
                    
                    <td className={t.type === 'Alım' ? 'text-success' : 'text-danger'}>
                      <strong>{t.type}</strong>
                    </td>
                    <td>{t.amount}</td>
                    <td>{t.price}</td>
                    <td style={{ opacity: 0.8 }}>{t.date}</td>
                    <td>
                      <span className="status completed" style={{ background: '#22c55e', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        Tamamlandı
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;