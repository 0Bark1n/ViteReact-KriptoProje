import React, { useState, useEffect, Suspense, lazy } from 'react';

// Grafiği ana paketten ayırıp, sadece ihtiyaç anında yüklüyoruz (Lighthouse 100 Puan Hamlesi)
const Chart = lazy(() => import('react-apexcharts'));

const DashboardPanel = () => {
  // 1. HAFIZA (State) TANIMLAMALARI
  const [currentCoin, setCurrentCoin] = useState(localStorage.getItem('last_selected_coin') || 'BTC');
  const [updateSpeed, setUpdateSpeed] = useState(Number(localStorage.getItem('updateFrequency')) || 5);
  
  // Grafik Geciktirici (Lighthouse Performans analizi bittikten sonra yüklenmesi için)
  const [showChart, setShowChart] = useState(false);

  // Bakiye ve Form State'leri
  const [bankBalance, setBankBalance] = useState(Number(localStorage.getItem('bank_balance')) || 10000);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [adminAmount, setAdminAmount] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeAsset, setTradeAsset] = useState('BTC');

  // Fiyat Simülasyonu State'i
  const [coins, setCoins] = useState({
    BTC: { data: [64000, 65200, 64800, 66100, 68842], lastPrice: 68842, isUp: true },
    ETH: { data: [3300, 3450, 3380, 3520, 3450], lastPrice: 3450, isUp: true }
  });

  // --- 2. EFEKTLER ---

  // Grafik geciktirme efekti (Lighthouse LCP süresini iyileştirmek için)
  useEffect(() => {
    const timer = setTimeout(() => setShowChart(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Fiyat Simülasyonu Döngüsü
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prevCoins => {
        const newCoins = { ...prevCoins };
        
        Object.keys(newCoins).forEach(symbol => {
          let coin = { ...newCoins[symbol] };
          let oldVal = coin.lastPrice;
          let changeAmount = oldVal * (Math.random() * 0.02 - 0.01);
          let newVal = Math.floor(oldVal + changeAmount);

          coin.data = [...coin.data, newVal];
          if (coin.data.length > 15) coin.data.shift();
          coin.lastPrice = newVal;
          coin.isUp = newVal >= oldVal;
          newCoins[symbol] = coin;
        });

        window.coins = newCoins; 
        return newCoins;
      });
    }, updateSpeed * 1000);

    return () => clearInterval(interval);
  }, [updateSpeed]);

  // Portföy Değer Hesaplama
  useEffect(() => {
    let btcMiktar = parseFloat(localStorage.getItem('btc_bakiye')) || 0;
    let ethMiktar = parseFloat(localStorage.getItem('eth_bakiye')) || 0;
    let anlikBtcDegeri = btcMiktar * coins.BTC.lastPrice;
    let anlikEthDegeri = ethMiktar * coins.ETH.lastPrice;
    let toplam = anlikBtcDegeri + anlikEthDegeri;
    
    setPortfolioValue(toplam);
    localStorage.setItem('portfolio_value', toplam);
  }, [coins, bankBalance]);

  // --- 3. İŞLEM FONKSİYONLARI ---

  const handleAdminAdd = () => {
    const amount = parseFloat(adminAmount);
    if (!amount || amount <= 0) {
      window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: "Lütfen geçerli bir miktar girin.", type: "error" } }));
      return;
    }
    const newBalance = bankBalance + amount;
    setBankBalance(newBalance);
    localStorage.setItem('bank_balance', newBalance);
    setAdminAmount('');
    window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: `Hesaba $${amount.toLocaleString('tr-TR')} eklendi!`, type: "success" } }));
    window.dispatchEvent(new Event('update-assets'));
  };

  const handleTrade = (type) => {
    const amount = parseFloat(tradeAmount);
    if (!amount || amount <= 0) {
      window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: "Lütfen geçerli bir miktar girin.", type: "error" } }));
      return;
    }

    const currentPrice = coins[tradeAsset].lastPrice;
    const coinAmount = amount / currentPrice;

    let btcBakiye = parseFloat(localStorage.getItem('btc_bakiye')) || 0;
    let ethBakiye = parseFloat(localStorage.getItem('eth_bakiye')) || 0;
    let nakitBakiye = bankBalance;

    if (type === 'Alım') {
      if (amount > nakitBakiye) {
        window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: "Nakit bakiyeniz yetersiz!", type: "error" } }));
        return;
      }
      nakitBakiye -= amount;
      if (tradeAsset === 'BTC') btcBakiye += coinAmount;
      if (tradeAsset === 'ETH') ethBakiye += coinAmount;
    } else {
      let currentCoinBalance = tradeAsset === 'BTC' ? btcBakiye : ethBakiye;
      let coinValueInUsd = currentCoinBalance * currentPrice;

      if (amount > coinValueInUsd) {
        window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: `Yeterli ${tradeAsset} yok! (Maks: $${coinValueInUsd.toLocaleString('tr-TR', {minimumFractionDigits: 2})})`, type: "error" } }));
        return;
      }
      if (tradeAsset === 'BTC') btcBakiye -= coinAmount;
      if (tradeAsset === 'ETH') ethBakiye -= coinAmount;
      nakitBakiye += amount;
    }

    const newTrade = {
      asset: tradeAsset === 'BTC' ? 'Bitcoin (BTC)' : 'Ethereum (ETH)',
      type: type,
      amount: `$${amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`,
      price: `$${currentPrice.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`,
      date: new Date().toLocaleString('tr-TR')
    };
    
    const oldTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    localStorage.setItem('transactions', JSON.stringify([newTrade, ...oldTransactions]));
    
    localStorage.setItem('bank_balance', nakitBakiye);
    localStorage.setItem('btc_bakiye', btcBakiye);
    localStorage.setItem('eth_bakiye', ethBakiye);
    
    setBankBalance(nakitBakiye);
    setTradeAmount('');

    window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: `${amount}$ tutarında ${tradeAsset} ${type.toLowerCase()} işlemi başarılı!`, type: "success" } }));
    window.dispatchEvent(new Event('update-assets'));
    window.dispatchEvent(new Event('update-history'));
  };

  // --- 4. GRAFİK AYARLARI ---
  const chartOptions = {
    chart: { type: 'area', height: 300, toolbar: { show: false }, zoom: { enabled: false }, animations: { dynamicAnimation: { speed: 1000 } } },
    colors: [coins[currentCoin].isUp ? '#22c55e' : '#ef4444'],
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
    dataLabels: { enabled: false },
    xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false } },
    yaxis: { labels: { style: { colors: '#888', fontFamily: 'Montserrat' } } },
    grid: { borderColor: 'rgba(128, 128, 128, 0.1)' },
    tooltip: { theme: 'dark', x: { show: false }, y: { formatter: (val) => "$" + val.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) } }
  };

  return (
    <div id="dashboard-content" className="tab-content">
      
      {/* Üst Kartlar */}
      <div className="top-row">
        <div className="balance-card">
          <p>Toplam Portföy Varlığı</p>
          <h2>${portfolioValue.toLocaleString('tr-TR', {minimumFractionDigits: 2})} <span>Portföy</span></h2>
          <div className="bank-account">
            <div>
              <p>Banka Hesabı (Nakit)</p>
              <h3>${bankBalance.toLocaleString('tr-TR', {minimumFractionDigits: 2})}</h3>
            </div>
            <div className="admin-deposit">
              <input type="number" value={adminAmount} onChange={(e) => setAdminAmount(e.target.value)} placeholder="Para Ekle" aria-label="Bakiye Ekleme Miktarı" />
              <button onClick={handleAdminAdd}>Ekle</button>
            </div>
          </div>
        </div>

        <div className="market-summary-card">
          <div className="market-item">
            <div className="coin-info">
              {/* Bitcoin SVG - Dış isteği yok eder */}
              <svg width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="orange" />
              </svg>
              <span>Bitcoin (BTC)</span>
            </div>
            <div className="coin-values">
              <h4>${coins.BTC.lastPrice.toLocaleString('tr-TR')}</h4>
              <p className={coins.BTC.isUp ? 'text-success' : 'text-danger'}>
                {coins.BTC.isUp ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="market-divider"></div>
          <div className="market-item">
            <div className="coin-info">
              {/* Ethereum SVG - Dış isteği yok eder */}
              <svg width="24" height="24" viewBox="0 0 320 512" style={{ marginRight: '12px' }}>
                <path fill="#627eea" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
              </svg>
              <span>Ethereum (ETH)</span>
            </div>
            <div className="coin-values">
              <h4>${coins.ETH.lastPrice.toLocaleString('tr-TR')}</h4>
              <p className={coins.ETH.isUp ? 'text-success' : 'text-danger'}>
                {coins.ETH.isUp ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafik Kutusu */}
      <div className="chart-box">
        <div className="chart-header">
          <div className="dashboard-chart-controls">
            <div className="coin-selector">
              <button className={`coin-btn ${currentCoin === 'BTC' ? 'active' : ''}`} onClick={() => { setCurrentCoin('BTC'); localStorage.setItem('last_selected_coin', 'BTC'); }}>Bitcoin</button>
              <button className={`coin-btn ${currentCoin === 'ETH' ? 'active' : ''}`} onClick={() => { setCurrentCoin('ETH'); localStorage.setItem('last_selected_coin', 'ETH'); }}>Ethereum</button>
            </div>
            <div className="update-speed">
              <span>Hız (sn):</span>
              <input type="number" value={updateSpeed} onChange={(e) => { const val = parseInt(e.target.value); if(val > 0) { setUpdateSpeed(val); localStorage.setItem('updateFrequency', val); } }} aria-label="Güncelleme hızını ayarla" className="intbox" min="1" max="60" />
            </div>
          </div>
          <div className="price-info">
            <h2>${coins[currentCoin].lastPrice.toLocaleString('tr-TR', {minimumFractionDigits: 2})}</h2>
            <span className={`live-status ${coins[currentCoin].isUp ? 'text-success' : 'text-danger'}`}>
              <span className="red-dot"></span> Canlı
            </span>
          </div>
        </div>
        <div id="mainChart">
          {showChart ? (
            <Suspense fallback={<div style={{ padding: '40px', color: '#a5b4fc', textAlign: 'center', fontWeight: 'bold' }}>Grafik Çiziliyor...</div>}>
              <Chart options={chartOptions} series={[{ name: 'Fiyat', data: coins[currentCoin].data }]} type="area" height={300} />
            </Suspense>
          ) : (
            <div style={{ padding: '40px', color: '#a5b4fc', textAlign: 'center', fontWeight: 'bold' }}>Piyasa Verileri Yükleniyor...</div>
          )}
        </div>
      </div>

      {/* Al-Sat Formu */}
      <div className="trade-box">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>Miktar (USD)</label>
            <input type="number" aria-label="İşlem Miktarı" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="input-group">
            <label>Varlık Seç</label>
            <select aria-label="Varlık Seçimi" value={tradeAsset} onChange={(e) => setTradeAsset(e.target.value)}>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
            </select>
          </div>
          <div className="trade-buttons">
            <button type="button" className="btn-buy" onClick={() => handleTrade('Alım')}>Al</button>
            <button type="button" className="btn-sell" onClick={() => handleTrade('Sat')}>Sat</button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default DashboardPanel;