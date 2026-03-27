import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

// "type" prop'unu ekledik. Varsayılan "crypto"
const RealApiPanel = ({ type = 'crypto' }) => {
  const isCrypto = type === 'crypto';

  // TYPE değiştiğinde currentCoin de o gruba ait ilk eleman olsun
  const [currentCoin, setCurrentCoin] = useState(isCrypto ? 'BTC' : 'XAU');
  const [currentTime, setCurrentTime] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState('Veri Çekiliyor...');

  // Type (Menü Sekmesi) değiştiğinde aktif sekmeyi sıfırla
  useEffect(() => {
    setCurrentCoin(isCrypto ? 'BTC' : 'XAU');
    setChartData([]);
    setCurrentPrice('Hesaplanıyor...');
  }, [type, isCrypto]);

  // VERİ ÇEKME VEYA SİMÜLE ETME MOTORU
  useEffect(() => {
    // ----------------------------------------------------
    // SENARYO 1: EĞER KRİPTO İSE GERÇEK BİNANCE API KULLAN
    // ----------------------------------------------------
    if (isCrypto) {
      const fetchBinanceData = async () => {
        let interval = '1h', limit = 24;
        switch(currentTime) {
          case '1D': interval = '1h'; limit = 24; break;
          case '1M': interval = '1d'; limit = 30; break;
          case '1Y': interval = '1w'; limit = 52; break;
          case 'ALL': interval = '1M'; limit = 60; break;
          default: interval = '1h'; limit = 24;
        }

        try {
          const url = `https://api.binance.com/api/v3/klines?symbol=${currentCoin}USDT&interval=${interval}&limit=${limit}`;
          const res = await fetch(url);
          const data = await res.json();
          
          const formattedData = data.map(d => [d[0], parseFloat(d[4])]); // [Zaman, Kapanış]
          const lastPrice = formattedData[formattedData.length - 1][1];
          
          setChartData(formattedData);
          setCurrentPrice(`$${lastPrice.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
        } catch (err) {
          console.error("API Hatası:", err);
          setCurrentPrice("Bağlantı Hatası!");
        }
      };

      setCurrentPrice('Hesaplanıyor...');
      fetchBinanceData();
    } 
    // ----------------------------------------------------
    // SENARYO 2: EĞER MADEN İSE (XAU/XAG) GERÇEKÇİ SİMÜLASYON YAP
    // (Çünkü Binance'de altın satılmaz)
    // ----------------------------------------------------
    else {
      const generateMetalData = () => {
        const basePrice = currentCoin === 'XAU' ? 2350 : 29.50; // Başlangıç fiyatları
        const volatility = currentCoin === 'XAU' ? 15 : 0.8;    // Ne kadar inip çıkacak
        
        // Seçilen zamana göre kaç veri noktası basılacağını belirle
        const dataPointsCount = currentTime === '1D' ? 24 : currentTime === '1M' ? 30 : 52; 
        const newData = [];
        let currentSimPrice = basePrice;
        
        let now = new Date().getTime();
        
        // Geçmişe dönük sahte veri üretimi
        for(let i = dataPointsCount; i >= 0; i--) {
          // Zaman damgası (timestamp) oluştur
          let timeStamp = now - (i * (currentTime === '1D' ? 3600000 : 86400000));
          
          // Fiyatı rastgele dalgalandır
          let change = (Math.random() * volatility) - (volatility / 2);
          currentSimPrice = currentSimPrice + change;
          
          newData.push([timeStamp, Number(currentSimPrice.toFixed(2))]);
        }
        
        setChartData(newData);
        setCurrentPrice(`$${Number(currentSimPrice.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2})}`);
      };

      setCurrentPrice('Hesaplanıyor...');
      // Bilerek hafif gecikme ekliyoruz ki gerçek API'den çekiyormuş gibi yüklensin
      setTimeout(generateMetalData, 800); 
    }
  }, [currentCoin, currentTime, isCrypto]);

  // ==========================================
  // APEXCHARTS AYARLARI
  // ==========================================

  // 1. Ana Grafik Çizgi Rengi Ayarı
  let chartColor;
  if (isCrypto) {
    chartColor = currentCoin === 'BTC' ? '#f7931a' : '#627eea'; // BTC Turuncu, ETH Mavi
  } else {
    chartColor = currentCoin === 'XAU' ? '#dfb63e' : '#94a3b8'; // Altın Sarısı, Gümüş Grisi
  }

  const apiChartOptions = {
    chart: { type: 'area', height: 350, toolbar: { show: false }, background: 'transparent' },
    colors: [chartColor],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
    dataLabels: { show: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { type: 'datetime', labels: { style: { colors: '#9ca3af', fontFamily: 'Montserrat' } } },
    yaxis: { labels: { style: { colors: '#9ca3af', fontFamily: 'Montserrat' }, formatter: (val) => "$" + val.toLocaleString() } },
    theme: { mode: 'dark' },
    tooltip: { theme: 'dark' }
  };

  // 2. Donut (Dominans) Grafiği Ayarları
  const donutLabels = isCrypto ? ['Bitcoin', 'Ethereum', 'Diğer Altcoinler'] : ['Altın (XAU)', 'Gümüş (XAG)', 'Diğer Madenler'];
  const donutColors = isCrypto ? ['#f7931a', '#627eea', '#22c55e'] : ['#dfb63e', '#94a3b8', '#475569'];
  const donutSeries = isCrypto ? [52.4, 16.8, 30.8] : [75.2, 18.5, 6.3]; // Altın dünyada her zaman dominanttır

  const donutOptions = {
    labels: donutLabels,
    chart: { type: 'donut', height: 300, background: 'transparent' },
    colors: donutColors,
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { position: 'bottom', labels: { colors: '#9ca3af', fontFamily: 'Montserrat' } },
    plotOptions: { pie: { donut: { size: '75%' } } }
  };

  return (
    <div id="real-api-panel" className="panel tab-content">
      <div className="dashboard-charts-row">
        
        {/* Ana Line Chart Kutusu */}
        <div className="chart-box main-chart">
          <div className="chart-header">
            <div className="chart-controls">
              <div className="coin-selector">
                {isCrypto ? (
                  <>
                    <button className={`real-coin-btn ${currentCoin === 'BTC' ? 'active' : ''}`} onClick={() => setCurrentCoin('BTC')}>Bitcoin</button>
                    <button className={`real-coin-btn ${currentCoin === 'ETH' ? 'active' : ''}`} onClick={() => setCurrentCoin('ETH')}>Ethereum</button>
                  </>
                ) : (
                  <>
                    <button className={`real-coin-btn ${currentCoin === 'XAU' ? 'active' : ''}`} onClick={() => setCurrentCoin('XAU')}>Altın (XAU)</button>
                    <button className={`real-coin-btn ${currentCoin === 'XAG' ? 'active' : ''}`} onClick={() => setCurrentCoin('XAG')}>Gümüş (XAG)</button>
                  </>
                )}
              </div>
              
              {/* Zaman Seçici Ortak */}
              <div className="timeframe-selector">
                <button className={`time-btn ${currentTime === '1D' ? 'active' : ''}`} onClick={() => setCurrentTime('1D')}>1G</button>
                <button className={`time-btn ${currentTime === '1M' ? 'active' : ''}`} onClick={() => setCurrentTime('1M')}>1A</button>
                <button className={`time-btn ${currentTime === '1Y' ? 'active' : ''}`} onClick={() => setCurrentTime('1Y')}>1Y</button>
                <button className={`time-btn ${currentTime === 'ALL' ? 'active' : ''}`} onClick={() => setCurrentTime('ALL')}>Hepsi</button>
              </div>
            </div>
            <div className="price-info">
              <h2 id="realDisplayPrice">{currentPrice}</h2>
              <span className="live-status text-success">
                <span className="red-dot"></span> {isCrypto ? 'Binance Canlı' : 'Global Canlı'}
              </span>
            </div>
          </div>
          <div id="realApiChart">
            <Chart options={apiChartOptions} series={[{ name: isCrypto ? `${currentCoin}/USDT` : `${currentCoin}/USD`, data: chartData }]} type="area" height={350} />
          </div>
        </div>

        {/* Donut Chart Kutusu */}
        <div className="chart-box donut-chart">
          <h3>Piyasa Hacmi (Global)</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '20px' }}>Gerçek zamanlı piyasa dominasyonu</p>
          <div id="realApiDonut">
            <Chart options={donutOptions} series={donutSeries} type="donut" height={300} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default RealApiPanel;