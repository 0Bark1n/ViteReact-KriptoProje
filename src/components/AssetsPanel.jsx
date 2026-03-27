import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const AssetsPanel = () => {
  const [assets, setAssets] = useState({
    nakit: 10000, 
    btcMiktar: 0, ethMiktar: 0, 
    xauMiktar: 0, xagMiktar: 0,
    btcDeger: 0, ethDeger: 0, 
    xauDeger: 0, xagDeger: 0,
    toplam: 0
  });

  // Varlıkları hesaplayan fonksiyon
  const calculateAssets = () => {
    let nakit = parseFloat(localStorage.getItem('bank_balance')) || 10000;
    
    // Kripto Bakiyeleri
    let btcMiktar = parseFloat(localStorage.getItem('btc_bakiye')) || 0;
    let ethMiktar = parseFloat(localStorage.getItem('eth_bakiye')) || 0;
    
    // Maden Bakiyeleri
    let xauMiktar = parseFloat(localStorage.getItem('xau_bakiye')) || 0;
    let xagMiktar = parseFloat(localStorage.getItem('xag_bakiye')) || 0;

    let btcFiyat = (window.coins && window.coins['BTC']) ? window.coins['BTC'].lastPrice : 68842;
    let ethFiyat = (window.coins && window.coins['ETH']) ? window.coins['ETH'].lastPrice : 3450;
    let xauFiyat = (window.coins && window.coins['XAU']) ? window.coins['XAU'].lastPrice : 2340;
    let xagFiyat = (window.coins && window.coins['XAG']) ? window.coins['XAG'].lastPrice : 29.5;

    let btcDeger = btcMiktar * btcFiyat;
    let ethDeger = ethMiktar * ethFiyat;
    let xauDeger = xauMiktar * xauFiyat;
    let xagDeger = xagMiktar * xagFiyat;
    
    let toplamVarlik = nakit + btcDeger + ethDeger + xauDeger + xagDeger;
    
    setAssets({
      nakit, 
      btcMiktar, ethMiktar, xauMiktar, xagMiktar,
      btcDeger, ethDeger, xauDeger, xagDeger,
      toplam: toplamVarlik
    });
  };

  useEffect(() => {
    calculateAssets(); 
    
    let updateSeconds = parseInt(localStorage.getItem('updateFrequency')) || 5;
    const interval = setInterval(() => {
      calculateAssets();
    }, updateSeconds * 1000);

    window.addEventListener('update-assets', calculateAssets);

    return () => {
      clearInterval(interval);
      window.removeEventListener('update-assets', calculateAssets);
    };
  }, []);

  const donutOptions = {
    labels: ['Nakit', 'Bitcoin (BTC)', 'Ethereum (ETH)', 'Altın (XAU)', 'Gümüş (XAG)'],
    chart: { type: 'donut', background: 'transparent', animations: { dynamicAnimation: { speed: 350 } } },
    colors: ['#22c55e', '#f7931a', '#627eea', '#dfb63e', '#94a3b8'],
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
            <Chart 
              options={donutOptions} 
              series={[assets.nakit, assets.btcDeger, assets.ethDeger, assets.xauDeger, assets.xagDeger]} 
              type="donut" 
              height={350} 
            />
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
                {/* 1. NAKİT */}
                <tr>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className="fas fa-wallet" style={{ color: '#22c55e', fontSize: '1.2rem' }}></i>
                    <strong style={{ color: '#22c55e' }}>Ortak Nakit</strong>
                  </td>
                  <td>-</td>
                  <td>${assets.nakit.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                
                {/* 2. BITCOIN */}
                <tr>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="22" height="22" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="80" fill="#f7931a" />
                    </svg>
                    <strong style={{ color: '#f7931a' }}>Bitcoin (BTC)</strong>
                  </td>
                  <td>{assets.btcMiktar.toFixed(4)}</td>
                  <td>${assets.btcDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>

                {/* 3. ETHEREUM */}
                <tr>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="22" height="22" viewBox="0 0 320 512">
                      <path fill="#627eea" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
                    </svg>
                    <strong style={{ color: '#627eea' }}>Ethereum (ETH)</strong>
                  </td>
                  <td>{assets.ethMiktar.toFixed(4)}</td>
                  <td>${assets.ethDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>

                {/* 4. ALTIN */}
                <tr>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className="fas fa-coins" style={{ color: '#dfb63e', fontSize: '1.2rem' }}></i>
                    <strong style={{ color: '#dfb63e' }}>Altın Ons (XAU)</strong>
                  </td>
                  <td>{assets.xauMiktar.toFixed(2)}</td>
                  <td>${assets.xauDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>

                {/* 5. GÜMÜŞ */}
                <tr>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className="fas fa-ring" style={{ color: '#94a3b8', fontSize: '1.2rem' }}></i>
                    <strong style={{ color: '#94a3b8' }}>Gümüş Ons (XAG)</strong>
                  </td>
                  <td>{assets.xagMiktar.toFixed(2)}</td>
                  <td>${assets.xagDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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