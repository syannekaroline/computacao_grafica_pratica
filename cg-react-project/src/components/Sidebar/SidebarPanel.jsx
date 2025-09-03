import React from 'react';
import './SidebarPanel.css';
import TableView from '../TableView/TableView';

function SidebarPanel(props) {
  const {
    activeMenu,
    points,
    onPointChange,
    onAddPoint,
    onRemovePoint,
    // Futuramente, outros parâmetros serão passados aqui
  } = props;

  return (
    <div className="sidebar-panel">
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
        <TableView
          points={points}
          onPointChange={onPointChange}
          onAddPoint={onAddPoint}
          onRemovePoint={onRemovePoint}
        />
      )}
    </div>
  );
}

export default SidebarPanel;