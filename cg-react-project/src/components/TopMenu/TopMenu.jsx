import React from 'react';
import './TopMenu.css';

const ResetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v6h6" />
    <path d="M21 12A9 9 0 006 5.3L3 8" />
    <path d="M21 22v-6h-6" />
    <path d="M3 12a9 9 0 0015 6.7l3-2.7" />
  </svg>
);


// Receba onReset como propriedade
function TopMenu({ currentMode, onModeChange, onReset }) {
  return (
    <header className="top-menu-container">
      <div className="menu-title">
        <h3>CG</h3>
        <span>Computação Gráfica - Universidade Federal do Pará</span>
      </div>

      <div className="action-group">
        {/* Adicione o onClick ao botão */}
        <button className="tool-button" title="Resetar Visualização" onClick={onReset}>
          <ResetIcon />
          <span>Resetar visualização</span>
        </button>
      </div>
    </header>
  );
}

export default TopMenu;