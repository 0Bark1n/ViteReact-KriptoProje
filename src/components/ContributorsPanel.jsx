import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import beratImg from '../assets/berat.jpeg';
import baranImg from '../assets/baran.jpeg';
import zerdestImg from '../assets/zerdest.jpg';
import defaultImg from '../assets/user-icon.png';

const contributors = [
  { name: "Berat Can Dağlı", id: "250701001", img: beratImg },
  { name: "Baran Akşen", id: "250701018", img: baranImg },
  { name: "Zerdeşt Temel", id: "250701025", img: zerdestImg },
  { name: "Barkın Arık", id: "250701030", img: defaultImg }
];

const ContributorsPanel = () => {
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    data: null,
    rect: null,
    isExpanded: false
  });

  const handleOpen = (e, person) => {
    const rect = e.target.getBoundingClientRect();
    setLightbox({ isOpen: true, data: person, rect, isExpanded: false });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLightbox(prev => ({ ...prev, isExpanded: true }));
      });
    });
  };

  const handleClose = () => {
    setLightbox(prev => ({ ...prev, isExpanded: false }));
    setTimeout(() => {
      setLightbox({ isOpen: false, data: null, rect: null, isExpanded: false });
    }, 500);
  };

  return (
    <div id="contributors-panel" className="settings-panel tab-content">
      
      {/* Kartların Listelendiği Alan */}
      <div className="contributors-grid">
        {contributors.map((person, index) => (
          <div key={index} className="contributor-card">
            <img 
              src={person.img} 
              alt={person.name} 
              className="user-logo" 
              onClick={(e) => handleOpen(e, person)} 
            />
            <h4>{person.name}</h4>
            <span>{person.id}</span>
          </div>
        ))}
      </div>

      {/* PORTAL KULLANIMI: Lightbox'ı HTML Body'sinin en üstüne ışınlıyoruz */}
      {createPortal(
        <div 
          className={`lightbox ${lightbox.isOpen ? 'active-bg' : ''} ${lightbox.isExpanded ? 'expanded' : ''}`}
          style={{ display: lightbox.isOpen ? 'block' : 'none' }}
          onClick={(e) => { 
            if (e.target.classList.contains('lightbox')) handleClose(); 
          }}
        >
          <span className="lightbox-close" onClick={handleClose}>&times;</span>
          
          <div 
            className="lightbox-wrapper" 
            style={{
              top: lightbox.rect ? lightbox.rect.top : 0,
              left: lightbox.rect ? lightbox.rect.left : 0,
              width: lightbox.rect ? lightbox.rect.width : 0,
              height: lightbox.rect ? lightbox.rect.height : 0,
              transform: 'translate(0, 0)',
              transition: lightbox.isOpen ? 'all 0.5s cubic-bezier(0.25, 1, 0.3, 1.1)' : 'none'
            }}
          >
            {lightbox.data && (
              <>
                <img src={lightbox.data.img} className="lightbox-img" alt={lightbox.data.name} />
                <div className="lightbox-text">
                  {lightbox.data.name}<br />
                  <span className="lightbox-id">{lightbox.data.id}</span>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body // Portalın gönderildiği yer
      )}

    </div>
  );
};

export default ContributorsPanel;