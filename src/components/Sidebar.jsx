import React, { useState } from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [openGroup, setOpenGroup] = useState('borsa');

  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="accordion-menu">
          
          {/* ========================================== */}
          {/* 1. BORSA MENÜSÜ (Sadece Al/Sat ve Piyasalar) */}
          {/* ========================================== */}
          <li className={`menu-group ${openGroup === 'borsa' ? 'open' : ''}`}>
            <button className="menu-toggle" onClick={() => setOpenGroup(openGroup === 'borsa' ? '' : 'borsa')}>
              <span className="title"><i className="fas fa-chart-line"></i> Borsa (Kripto)</span>
              <i className="fas fa-chevron-down arrow"></i>
            </button>
            <ul className="submenu">
              <li><a href="#" className={activeTab === 'dashboard-content' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'dashboard-content')}><i className="fas fa-exchange-alt"></i> Kripto Al/Sat</a></li>
              <li><a href="#" className={activeTab === 'real-api-panel' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'real-api-panel')}><i className="fas fa-globe"></i> Kripto Piyasalar</a></li>
              <li><a href="#" className={activeTab === 'currency-panel' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'currency-panel')}><i className="fas fa-money-bill-wave"></i> Döviz Çevirici</a></li>
            </ul>
          </li>

          {/* ========================================== */}
          {/* 2. MADENLER MENÜSÜ (Sadece Al/Sat ve Piyasalar) */}
          {/* ========================================== */}
          <li className={`menu-group ${openGroup === 'madenler' ? 'open' : ''}`}>
            <button className="menu-toggle" onClick={() => setOpenGroup(openGroup === 'madenler' ? '' : 'madenler')}>
              <span className="title"><i className="fas fa-cubes"></i> Madenler</span>
              <i className="fas fa-chevron-down arrow"></i>
            </button>
            <ul className="submenu">
              <li><a href="#" className={activeTab === 'metals-dashboard' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'metals-dashboard')}><i className="fas fa-balance-scale"></i> Maden Al/Sat</a></li>
              <li><a href="#" className={activeTab === 'metals-api' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'metals-api')}><i className="fas fa-chart-line"></i> Maden Piyasalar</a></li>
            </ul>
          </li>

          {/* ========================================== */}
          {/* 3. YENİ: CÜZDANIM (Ortak Havuz) */}
          {/* ========================================== */}
          <li className={`menu-group ${openGroup === 'cuzdan' ? 'open' : ''}`}>
            <button className="menu-toggle" onClick={() => setOpenGroup(openGroup === 'cuzdan' ? '' : 'cuzdan')}>
              <span className="title"><i className="fas fa-wallet"></i> Cüzdanım</span>
              <i className="fas fa-chevron-down arrow"></i>
            </button>
            <ul className="submenu">
              <li><a href="#" className={activeTab === 'assets-panel' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'assets-panel')}><i className="fas fa-chart-pie"></i> Tüm Varlıklarım</a></li>
              <li><a href="#" className={activeTab === 'history-panel' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'history-panel')}><i className="fas fa-history"></i> Ortak İşlem Geçmişi</a></li>
            </ul>
          </li>

          {/* ========================================== */}
          {/* 4. DİĞER MENÜSÜ */}
          {/* ========================================== */}
          <li className={`menu-group ${openGroup === 'diger' ? 'open' : ''}`}>
            <button className="menu-toggle" onClick={() => setOpenGroup(openGroup === 'diger' ? '' : 'diger')}>
              <span className="title"><i className="fas fa-ellipsis-h"></i> Diğer</span>
              <i className="fas fa-chevron-down arrow"></i>
            </button>
            <ul className="submenu">
              <li><a href="#" className={activeTab === 'settings-panel' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'settings-panel')}><i className="fas fa-cog"></i> Ayarlar</a></li>
              <li><a href="#" className={activeTab === 'contributors-panel' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'contributors-panel')}><i className="fas fa-users"></i> Emeği Geçenler</a></li>
            </ul>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;