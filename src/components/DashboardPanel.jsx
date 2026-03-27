import React, { useState, useEffect, Suspense, lazy } from 'react';

const Chart = lazy(() => import('react-apexcharts'));

// TYPE PROP'UNU EKLEDİK (Varsayılan olarak 'crypto' gelir)
const DashboardPanel = ({ type = 'crypto' }) => {
  
  // 1. DİNAMİK VERİ KÜMELERİ (Type'a Göre Altın veya Kripto Seçilir)
  const isCrypto = type === 'crypto';
  
  const coinIds = isCrypto ? ['BTC', 'ETH'] : ['XAU', 'XAG'];
  const coinNames = isCrypto ? ['Bitcoin', 'Ethereum'] : ['Altın', 'Gümüş'];
  const coinSymbols = isCrypto ? ['Bitcoin (BTC)', 'Ethereum (ETH)'] : ['Altın (XAU) - Ons', 'Gümüş (XAG) - Ons'];
  
  // Hafızadaki son seçili coini type'a göre al (Altın sekmesinde BTC kalmasın diye)
  const defaultCoin = isCrypto ? (localStorage.getItem('last_selected_coin') || 'BTC') : (localStorage.getItem('last_selected_metal') || 'XAU');

  // HAFIZA (State) TANIMLAMALARI
  const [currentCoin, setCurrentCoin] = useState(defaultCoin);
  const [updateSpeed, setUpdateSpeed] = useState(Number(localStorage.getItem('updateFrequency')) || 5);
  const [showChart, setShowChart] = useState(false);

  // Ortak Banka Bakiyesi
  const [bankBalance, setBankBalance] = useState(Number(localStorage.getItem('bank_balance')) || 10000);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [adminAmount, setAdminAmount] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  
  // Alım/Satım seçeneğini Type'a göre ayarla
  const [tradeAsset, setTradeAsset] = useState(coinIds[0]); 

  // Fiyat Simülasyonu State'i (Altın ve Gümüş ons fiyatlarına yakın değerler eklendi)
  const [coins, setCoins] = useState({
    BTC: { data: [64000, 65200, 64800, 66100, 68842], lastPrice: 68842, isUp: true },
    ETH: { data: [3300, 3450, 3380, 3520, 3450], lastPrice: 3450, isUp: true },
    XAU: { data: [2300, 2315, 2310, 2325, 2340], lastPrice: 2340, isUp: true },  // Altın Ons
    XAG: { data: [28, 28.5, 28.2, 29, 29.5], lastPrice: 29.5, isUp: true }      // Gümüş Ons
  });

  // Type değiştiğinde (Menüden Kripto'dan Maden'e geçildiğinde) seçili sekmeyi sıfırla
  useEffect(() => {
      setCurrentCoin(coinIds[0]);
      setTradeAsset(coinIds[0]);
  }, [type]);

  // Efektler aynı kalıyor
  useEffect(() => {
    const timer = setTimeout(() => setShowChart(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prevCoins => {
        const newCoins = { ...prevCoins };
        Object.keys(newCoins).forEach(symbol => {
          let coin = { ...newCoins[symbol] };
          let oldVal = coin.lastPrice;
          
          // Altın ve gümüş kripto kadar oynamaz (Volatilite farkı)
          let volatility = (symbol === 'XAU' || symbol === 'XAG') ? 0.005 : 0.02; 
          let changeAmount = oldVal * (Math.random() * volatility - (volatility / 2));
          
          // Gümüş küsuratlı kalsın, diğerleri tam sayı
          let newVal = symbol === 'XAG' ? Number((oldVal + changeAmount).toFixed(2)) : Math.floor(oldVal + changeAmount);

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

  // Portföy Değer Hesaplama (Şimdilik sadece ekranda o anki tipi toplasın veya hepsini toplasın)
  useEffect(() => {
    // Toplam Varlık (Kripto + Maden)
    let btcDeğer = (parseFloat(localStorage.getItem('btc_bakiye')) || 0) * coins.BTC.lastPrice;
    let ethDeğer = (parseFloat(localStorage.getItem('eth_bakiye')) || 0) * coins.ETH.lastPrice;
    let xauDeğer = (parseFloat(localStorage.getItem('xau_bakiye')) || 0) * coins.XAU.lastPrice;
    let xagDeğer = (parseFloat(localStorage.getItem('xag_bakiye')) || 0) * coins.XAG.lastPrice;
    
    // Ekrana sadece ilgili sekmenin portföyünü mü basmak istersin, yoksa toplamı mı?
    // Burada "İlgili Sekmenin" toplamını gösteriyoruz.
    let toplam = isCrypto ? (btcDeğer + ethDeğer) : (xauDeğer + xagDeğer);
    
    setPortfolioValue(toplam);
  }, [coins, bankBalance, type]);

  // İşlem Fonksiyonları (Admin ekleme vs aynı)
  const handleAdminAdd = () => {
    const amount = parseFloat(adminAmount);
    if (!amount || amount <= 0) {
      // Hata Bildirimi
      window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: "Lütfen geçerli bir miktar girin.", type: "error" } }));
      return;
    }
    const newBalance = bankBalance + amount;
    setBankBalance(newBalance);
    localStorage.setItem('bank_balance', newBalance);
    setAdminAmount('');
    
    // Başarı Bildirimi
    window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: `Hesaba $${amount.toLocaleString('tr-TR')} eklendi!`, type: "success" } }));
    window.dispatchEvent(new Event('update-assets'));
  };
  const handleTrade = (tradeType) => {
      const amount = parseFloat(tradeAmount);
      if (!amount || amount <= 0) {
        window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: "Lütfen geçerli bir miktar girin.", type: "error" } }));
        return;
      }

      const currentPrice = coins[tradeAsset]?.lastPrice;
      if (!currentPrice) return;
      const coinAmount = amount / currentPrice;

      // Dinamik bakiye çekme
      const storageKey = `${tradeAsset.toLowerCase()}_bakiye`;
      let assetBalance = parseFloat(localStorage.getItem(storageKey)) || 0;
      let nakitBakiye = bankBalance;

      if (tradeType === 'Alım') {
        if (amount > nakitBakiye) {
          window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: "Nakit bakiyeniz yetersiz!", type: "error" } }));
          return;
        }
        nakitBakiye -= amount;
        assetBalance += coinAmount;
      } else {
        let coinValueInUsd = assetBalance * currentPrice;
        if (amount > coinValueInUsd) {
          window.dispatchEvent(new CustomEvent('trigger-notification', { detail: { message: `Yeterli ${tradeAsset} yok! (Maks: $${coinValueInUsd.toLocaleString('tr-TR', {minimumFractionDigits: 2})})`, type: "error" } }));
          return;
        }
        assetBalance -= coinAmount;
        nakitBakiye += amount;
      }

      // İşlem Adı
      const tradeName = isCrypto 
          ? (tradeAsset === 'BTC' ? 'Bitcoin (BTC)' : 'Ethereum (ETH)') 
          : (tradeAsset === 'XAU' ? 'Altın Ons (XAU)' : 'Gümüş Ons (XAG)');

      const newTrade = {
        asset: tradeName,
        type: tradeType,
        amount: `$${amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`,
        price: `$${currentPrice.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`,
        date: new Date().toLocaleString('tr-TR')
      };
      
      const oldTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
      localStorage.setItem('transactions', JSON.stringify([newTrade, ...oldTransactions]));
      
      localStorage.setItem('bank_balance', nakitBakiye);
      localStorage.setItem(storageKey, assetBalance); 
      
      setBankBalance(nakitBakiye);
      setTradeAmount('');

      // EKSİK OLAN BİLDİRİM FIRLATMA KODU (BURAYA EKLENDİ)
      window.dispatchEvent(new CustomEvent('trigger-notification', { 
        detail: { 
          message: `${amount}$ tutarında ${tradeName} ${tradeType.toLowerCase()} işlemi başarılı!`, 
          type: "success" 
        } 
      }));
      
      window.dispatchEvent(new Event('update-assets'));
      window.dispatchEvent(new Event('update-history'));
  };

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
          <p>{isCrypto ? 'Kripto Portföy Değeri' : 'Maden Portföy Değeri'}</p>
          <h2>${portfolioValue.toLocaleString('tr-TR', {minimumFractionDigits: 2})} <span>Varlık</span></h2>
          <div className="bank-account">
            <div>
              <p>Ortak Banka Hesabı</p>
              <h3>${bankBalance.toLocaleString('tr-TR', {minimumFractionDigits: 2})}</h3>
            </div>
            <div className="admin-deposit">
              <input type="number" value={adminAmount} onChange={(e) => setAdminAmount(e.target.value)} placeholder="Para Ekle" />
              <button onClick={handleAdminAdd}>Ekle</button>
            </div>
          </div>
        </div>

        {/* MARKET ÖZETİ (Type'a Göre Değişir) */}
        <div className="market-summary-card">
          <div className="market-item">
            <div className="coin-info">
              {isCrypto ? (
                <svg width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="orange" /></svg>
              ) : (
                <i className="fas fa-coins" style={{ color: '#fbbf24' }}></i>
              )}
              <span>{coinNames[0]} ({coinIds[0]})</span>
            </div>
            <div className="coin-values">
              <h4>${coins[coinIds[0]].lastPrice.toLocaleString('tr-TR')}</h4>
              <p className={coins[coinIds[0]].isUp ? 'text-success' : 'text-danger'}>
                {coins[coinIds[0]].isUp ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="market-divider"></div>
          <div className="market-item">
            <div className="coin-info">
             {isCrypto ? (
                <svg width="24" height="24" viewBox="0 0 320 512" style={{ marginRight: '12px' }}><path fill="#627eea" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              ) : (
                <i className="fas fa-ring" style={{ color: '#94a3b8' }}></i>
              )}
              <span>{coinNames[1]} ({coinIds[1]})</span>
            </div>
            <div className="coin-values">
              <h4>${coins[coinIds[1]].lastPrice.toLocaleString('tr-TR')}</h4>
              <p className={coins[coinIds[1]].isUp ? 'text-success' : 'text-danger'}>
                {coins[coinIds[1]].isUp ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafik ve Al/Sat kısmı (Sıfırdan type'a göre çalışır) */}
      <div className="chart-box">
        <div className="chart-header">
          <div className="dashboard-chart-controls">
            <div className="coin-selector">
              <button className={`coin-btn ${currentCoin === coinIds[0] ? 'active' : ''}`} onClick={() => setCurrentCoin(coinIds[0])}>{coinNames[0]}</button>
              <button className={`coin-btn ${currentCoin === coinIds[1] ? 'active' : ''}`} onClick={() => setCurrentCoin(coinIds[1])}>{coinNames[1]}</button>
            </div>
            <div className="update-speed">
              <span>Hız (sn):</span>
              <input type="number" value={updateSpeed} onChange={(e) => setUpdateSpeed(parseInt(e.target.value) || 5)} className="intbox" min="1" max="60" />
            </div>
          </div>
          <div className="price-info">
            <h2>${coins[currentCoin]?.lastPrice.toLocaleString('tr-TR', {minimumFractionDigits: 2})}</h2>
          </div>
        </div>
        <div id="mainChart">
          {showChart ? (
             <Suspense fallback={<div>Çiziliyor...</div>}>
              <Chart options={chartOptions} series={[{ name: 'Fiyat', data: coins[currentCoin].data }]} type="area" height={300} />
            </Suspense>
          ) : <div>Yükleniyor...</div>}
        </div>
      </div>

      <div className="trade-box">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>Miktar (USD)</label>
            <input type="number" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="input-group">
            <label>Varlık Seç</label>
            <select value={tradeAsset} onChange={(e) => setTradeAsset(e.target.value)}>
              <option value={coinIds[0]}>{coinSymbols[0]}</option>
              <option value={coinIds[1]}>{coinSymbols[1]}</option>
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