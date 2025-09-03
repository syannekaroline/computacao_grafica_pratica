import React from 'react';
import './SidebarNav.css';
import AlgorithmIcon from '../icons/AlgorithmIcon';
import TransformIcon from '../icons/TransformIcon';
import TableIcon from '../icons/TableIcon';

function SidebarNav({ activeMenu, onMenuChange }) {
  const getIconColor = (menuName) => {
    return activeMenu === menuName ? '#6557d2' : '#5f6368';
  };

  return (
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
  );
}

export default SidebarNav;