import React from 'react';
import './TopMenu.css';

// Ícones SVG como componentes para facilitar o uso
const SelectIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
  </svg>
);

const PanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2v-2" />
    <path d="M17.5 9.5a2.5 2.5 0 010-5h-13a2.5 2.5 0 010 5" />
    <path d="M22 12v-2" />
  </svg>
);

const ResetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v6h6" />
    <path d="M21 12A9 9 0 006 5.3L3 8" />
    <path d="M21 22v-6h-6" />
    <path d="M3 12a9 9 0 0015 6.7l3-2.7" />
  </svg>
);


function TopMenu({ currentMode, onModeChange }) {
  return (
    <header className="top-menu-container">
      <div className="menu-title">
        <h3>CG</h3>
        <span>Computação Gráfica - Universidade Federal do Pará</span>
      </div>

      <div className="tool-group">
        <button
          className={`tool-button ${currentMode === 'SELECT' ? 'active' : ''}`}
          onClick={() => onModeChange('SELECT')}
          title="Selecionar"
        >
          <SelectIcon />
        </button>
        <button
          className={`tool-button ${currentMode === 'PAN' ? 'active' : ''}`}
          onClick={() => onModeChange('PAN')}
          title="Mover (Pan)"
        >
          <PanIcon />
        </button>
      </div>

      <div className="action-group">
        <button className="tool-button" title="Resetar Visualização">
          <ResetIcon />
        </button>
      </div>
    </header>
  );
}

export default TopMenu;