// src/components/Sidebar/Sidebar.jsx

import React from 'react';
import './Sidebar.css';

// Importando nossos novos ícones
import AlgorithmIcon from '../icons/AlgorithmIcon';
import TransformIcon from '../icons/TransformIcon';
import TableIcon from '../icons/TableIcon';

function Sidebar(props) {
  const { activeMenu, onMenuChange } = props;

  // Função para determinar a cor do ícone (ativo ou inativo)
  const getIconColor = (menuName) => {
    return activeMenu === menuName ? '#6557d2' : '#5f6368'; // Roxo/Azul para ativo, cinza para inativo
  };

  return (
    <aside className="sidebar-container">
      <nav className="sidebar-nav">
        <button
          className={`nav-button ${activeMenu === 'ALGORITHMS' ? 'active' : ''}`}
          onClick={() => onMenuChange('ALGORITHMS')}
        >
          <AlgorithmIcon color={getIconColor('ALGORITHMS')} />
          <span>Algoritmos</span>
        </button>
        <button
          className={`nav-button ${activeMenu === 'TRANSFORMS' ? 'active' : ''}`}
          onClick={() => onMenuChange('TRANSFORMS')}
        >
          <TransformIcon color={getIconColor('TRANSFORMS')} />
          <span>Transformações</span>
        </button>
        <button
          className={`nav-button ${activeMenu === 'TABLE' ? 'active' : ''}`}
          onClick={() => onMenuChange('TABLE')}
        >
          <TableIcon color={getIconColor('TABLE')} />
          <span>Tabela</span>
        </button>
      </nav>

      <div className="sidebar-content">
        {activeMenu === 'ALGORITHMS' && (
          <div>
            <h3>Algoritmos de Rasterização</h3>
            <p>Lista de algoritmos (Bresenham, Círculo, etc.) aparecerá aqui.</p>
          </div>
        )}
        {activeMenu === 'TRANSFORMS' && (
          <div>
            <h3>Transformações Geométricas</h3>
            <p>Lista de transformações (Translação, Rotação, etc.) aparecerá aqui.</p>
          </div>
        )}
        {activeMenu === 'TABLE' && (
          <div>
            <h3>Tabela de Pontos</h3>
            <p>A tabela de pontos do objeto atual aparecerá aqui.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;