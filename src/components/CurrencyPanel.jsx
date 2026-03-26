import React, { useState, useEffect } from 'react';

const popularCurrencies = [
  { code: 'USD', flag: '🇺🇸' },
  { code: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', flag: '🇬🇧' },
  { code: 'JPY', flag: '🇯🇵' },
  { code: 'CHF', flag: '🇨🇭' },
  { code: 'AED', flag: '🇦🇪' }
];

const CurrencyPanel = () => {
  const [rates, setRates] = useState(null);
  const [amount, setAmount] = useState(50);
  const [from, setFrom] = useState('TRY');
  const [to, setTo] = useState('USD');
  const [lastUpdate, setLastUpdate] = useState('Bekleniyor...');
  const [nextUpdate, setNextUpdate] = useState('Hesaplanıyor...');

  // 1. API'DEN VERİ ÇEKME FONKSİYONU
  const fetchCurrencies = async () => {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      setRates(data.rates);

      // Saatleri Hesapla
      const formatOpts = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
      setLastUpdate(new Date(data.time_last_update_unix * 1000).toLocaleDateString('tr-TR', formatOpts));
      setNextUpdate(new Date(data.time_next_update_unix * 1000).toLocaleDateString('tr-TR', formatOpts));

      // Otomatik güncelleme sayacını kur (currency-manager.js mantığı)
      const now = Date.now();
      let timeUntilNext = (data.time_next_update_unix * 1000) - now;
      if (timeUntilNext < 0) timeUntilNext = 60000;

      setTimeout(() => {
        fetchCurrencies();
      }, timeUntilNext);

    } catch (err) {
      console.error("Döviz API Hatası:", err);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  // 2. HESAPLAMA MANTIĞI
  const calculateRate = () => {
    if (!rates || isNaN(amount) || !rates[from] || !rates[to]) return { result: 0, rate: 0 };
    const rate = rates[to] / rates[from];
    return {
      result: amount * rate,
      rate: rate
    };
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  const handlePopularClick = (code) => {
    setFrom('TRY');
    setTo(code);
  };

  const { result, rate } = calculateRate();

  return (
    <div id="currency-panel" className="tab-content">
      <div className="dashboard-charts-row">
        
        {/* Sol Taraf: Çevirici */}
        <div className="settings-card">
          <h3><i className="fas fa-money-bill-wave" style={{ color: '#22c55e' }}></i> Canlı Döviz Çevirici</h3>
          <p style={{ opacity: 0.7, marginBottom: '25px' }}>Gerçek zamanlı piyasa kurlarıyla para birimlerini anında dönüştürün.</p>
          
          <div className="currency-converter-box">
            <div className="input-group">
              <label>Miktar</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" />
            </div>
            
            <div className="currency-selectors">
              <div className="input-group">
                <label>Kimden</label>
                <select value={from} onChange={(e) => setFrom(e.target.value)}>
                  {rates && Object.keys(rates).map(r => <option key={`from-${r}`} value={r}>{r}</option>)}
                </select>
              </div>
              
              <button onClick={swapCurrencies} className="swap-btn" aria-label="Para birimlerinin yerini değiştir"><i className="fas fa-exchange-alt"></i></button>
              
              <div className="input-group">
                <label>Kime</label>
                <select value={to} onChange={(e) => setTo(e.target.value)}>
                  {rates && Object.keys(rates).map(r => <option key={`to-${r}`} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            
            <div className="currency-converter-box">
              <div className="currency-result">
                <h2>{rates ? `${result.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to}` : 'Yükleniyor...'}</h2>
                <p>{rates ? `1 ${from} = ${rate.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${to}` : 'Veriler çekiliyor...'}</p>
              </div>
              
              <div className="api-update-info">
                <i className="fas fa-sync-alt"></i> Son Güncelleme: <b>{lastUpdate}</b> | Sonraki: <b>{nextUpdate}</b>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Popüler Kurlar */}
        <div className="settings-card">
          <h3><i className="fas fa-star" style={{ color: '#f59e0b' }}></i> Popüler Kurlar</h3>
          <p style={{ opacity: 0.7, marginBottom: '20px' }}>Türk Lirası (TRY) Karşılıkları</p>
          
          <div className="popular-rates-list">
            {popularCurrencies.map(currency => {
              const tryRate = rates ? (rates['TRY'] / rates[currency.code]) : 0;
              return (
                <div key={currency.code} className="rate-item clickable-rate" onClick={() => handlePopularClick(currency.code)}>
                  <span>{currency.flag} {currency.code}</span>
                  <b>{rates ? `₺${tryRate.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Yükleniyor...'}</b>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CurrencyPanel;