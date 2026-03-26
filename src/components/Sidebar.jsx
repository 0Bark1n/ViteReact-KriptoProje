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
          
          <li className={`menu-group ${openGroup === 'borsa' ? 'open' : ''}`}>
            <button className="menu-toggle" onClick={() => setOpenGroup(openGroup === 'borsa' ? '' : 'borsa')}>
              <span className="title"><i className="fas fa-chart-line"></i> Borsa</span>
              <i className="fas fa-chevron-down arrow"></i>
            </button>
            <ul className="submenu">
              <li><a href="#" className={activeTab === 'dashboard-content' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'dashboard-content')}><i className="fas fa-th-large"></i> Dashboard</a></li>
              <li><a href="#" className={activeTab === 'real-api-panel' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'real-api-panel')}><i className="fas fa-globe"></i> Gerçek Piyasalar</a></li>
              <li><a href="#" className={activeTab === 'currency-panel' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'currency-panel')}><i className="fas fa-exchange-alt"></i> Döviz Çevirici</a></li>
              <li><a href="#" className={activeTab === 'assets-panel' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'assets-panel')}><i className="fas fa-chart-pie"></i> Varlıklarım</a></li>
              <li><a href="#" className={activeTab === 'history-panel' ? 'active' : ''} onClick={(e) => handleTabClick(e, 'history-panel')}><i className="fas fa-history"></i> İşlem Geçmişi</a></li>
            </ul>
          </li>

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