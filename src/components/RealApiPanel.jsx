import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const RealApiPanel = () => {
  const [currentCoin, setCurrentCoin] = useState('BTC');
  const [currentTime, setCurrentTime] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState('Veri Çekiliyor...');

  // Binance API'den Veri Çekme (Orijinal real-api.js mantığı)
  useEffect(() => {
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
  }, [currentCoin, currentTime]);

  // ApexCharts Ayarları (Ana Grafik)
  const chartColor = currentCoin === 'BTC' ? '#f7931a' : '#627eea';
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

  // ApexCharts Ayarları (Donut Dominans Grafiği)
  const donutOptions = {
    labels: ['Bitcoin', 'Ethereum', 'Diğer Altcoinler'],
    chart: { type: 'donut', height: 300, background: 'transparent' },
    colors: ['#f7931a', '#627eea', '#4f46e5'],
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
                <button className={`real-coin-btn ${currentCoin === 'BTC' ? 'active' : ''}`} onClick={() => setCurrentCoin('BTC')}>Bitcoin</button>
                <button className={`real-coin-btn ${currentCoin === 'ETH' ? 'active' : ''}`} onClick={() => setCurrentCoin('ETH')}>Ethereum</button>
              </div>
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
                <span className="red-dot"></span> Binance Canlı
              </span>
            </div>
          </div>
          <div id="realApiChart">
            <Chart options={apiChartOptions} series={[{ name: `${currentCoin}/USDT`, data: chartData }]} type="area" height={350} />
          </div>
        </div>

        {/* Donut Chart Kutusu */}
        <div className="chart-box donut-chart">
          <h3>Piyasa Hacmi (Global)</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '20px' }}>Gerçek zamanlı piyasa dominasyonu</p>
          <div id="realApiDonut">
            <Chart options={donutOptions} series={[52.4, 16.8, 30.8]} type="donut" height={300} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default RealApiPanel;