import React from 'react';
import './TableView.css';

function TableView({ points, onPointChange, onAddPoint, onRemovePoint }) {
  return (
    <div className="table-view-container">
      <h3>Tabela de Pontos</h3>
      <table className="points-table">
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  value={point.x}
                  onChange={(e) => onPointChange(index, 'x', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={point.y}
                  onChange={(e) => onPointChange(index, 'y', e.target.value)}
                />
              </td>
              <td>
                <button
                  className="remove-button"
                  onClick={() => onRemovePoint(index)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-button" onClick={onAddPoint}>
        Adicionar Ponto
      </button>
    </div>
  );
}

export default TableView;