import React, { useState, useEffect } from 'react';

const HistoryPanel = () => {
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = () => {
    const data = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(data);
  };

  useEffect(() => {
    loadTransactions();
    // Yeni işlem yapıldığında anında güncellenmesi için:
    window.addEventListener('update-history', loadTransactions);
    return () => window.removeEventListener('update-history', loadTransactions);
  }, []);

  return (
    <div id="history-panel" className="panel tab-content">
      <div className="history-table">
        <div className="table-header" style={{ marginBottom: '20px' }}>
          <h3>Tüm İşlemleriniz</h3>
          <p style={{ opacity: 0.7 }}>Geçmişten bugüne yaptığınız tüm alım-satım hareketleri.</p>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Varlık</th>
                <th>Tür</th>
                <th>Miktar</th>
                <th>Fiyat</th>
                <th>Tarih</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Henüz bir işlem yapmadınız.</td></tr>
              ) : (
                transactions.map((t, index) => (
                  <tr key={index} className="animate-row">
                    <td>{t.asset}</td>
                    <td className={t.type === 'Alım' ? 'text-success' : 'text-danger'}><strong>{t.type}</strong></td>
                    <td>{t.amount}</td>
                    <td>{t.price}</td>
                    <td>{t.date}</td>
                    <td><span className="status completed" style={{ background: '#22c55e', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem' }}>Tamamlandı</span></td>
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