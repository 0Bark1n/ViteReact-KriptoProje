import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const AssetsPanel = () => {
  const [assets, setAssets] = useState({
    nakit: 10000, btcMiktar: 0, ethMiktar: 0, btcDeger: 0, ethDeger: 0, toplam: 0
  });

  // Varlıkları hesaplayan fonksiyon (varlik-manager.js mantığı)
  const calculateAssets = () => {
    let nakit = parseFloat(localStorage.getItem('bank_balance')) || 10000;
    let btcMiktar = parseFloat(localStorage.getItem('btc_bakiye')) || 0;
    let ethMiktar = parseFloat(localStorage.getItem('eth_bakiye')) || 0;

    let btcFiyat = (window.coins && window.coins['BTC']) ? window.coins['BTC'].lastPrice : 68842;
    let ethFiyat = (window.coins && window.coins['ETH']) ? window.coins['ETH'].lastPrice : 3450;

    let btcDeger = btcMiktar * btcFiyat;
    let ethDeger = ethMiktar * ethFiyat;
    
    setAssets({
      nakit, btcMiktar, ethMiktar, btcDeger, ethDeger, toplam: nakit + btcDeger + ethDeger
    });
  };

  // Sayfa açıldığında ve belirli aralıklarla güncelle (setInterval)
  useEffect(() => {
    calculateAssets(); // İlk yükleme
    
    let updateSeconds = parseInt(localStorage.getItem('updateFrequency')) || 5;
    const interval = setInterval(() => {
      calculateAssets();
    }, updateSeconds * 1000);

    // Diğer sayfalardan (Al/Sat yapıldığında) anında tetiklenmesi için dinleyici
    window.addEventListener('update-assets', calculateAssets);

    return () => {
      clearInterval(interval);
      window.removeEventListener('update-assets', calculateAssets);
    };
  }, []);

  const donutOptions = {
    labels: ['Nakit', 'Bitcoin (BTC)', 'Ethereum (ETH)'],
    chart: { type: 'donut', background: 'transparent', animations: { dynamicAnimation: { speed: 350 } } },
    colors: ['#4f46e5', '#f7931a', '#627eea'],
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { position: 'bottom', labels: { colors: '#9ca3af', fontFamily: 'Montserrat' } },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { show: true, color: '#9ca3af' },
            value: { show: true, color: '#f8fafc', formatter: (val) => "$" + val.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) },
            total: { show: true, showAlways: true, label: 'Toplam Varlık', color: '#9ca3af', formatter: () => "$" + assets.toplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) }
          }
        }
      }
    }
  };

  return (
    <div id="assets-panel" className="panel tab-content">
      <div className="top-row">
        
        <div className="chart-box">
          <h3>Varlık Dağılımı</h3>
          <div style={{ marginTop: '20px' }}>
            <Chart options={donutOptions} series={[assets.nakit, assets.btcDeger, assets.ethDeger]} type="donut" height={350} />
          </div>
        </div>

        <div className="history-table">
          <h3>Varlık Detayları</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Varlık</th>
                  <th>Miktar</th>
                  <th>Değer (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style={{ color: '#4f46e5' }}>Nakit</strong></td>
                  <td>-</td>
                  <td>${assets.nakit.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#f7931a' }}>Bitcoin (BTC)</strong></td>
                  <td>{assets.btcMiktar.toFixed(4)}</td>
                  <td>${assets.btcDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#627eea' }}>Ethereum (ETH)</strong></td>
                  <td>{assets.ethMiktar.toFixed(4)}</td>
                  <td>${assets.ethDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AssetsPanel;