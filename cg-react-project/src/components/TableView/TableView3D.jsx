import React from 'react';
import './TableView.css'; // Reutiliza o mesmo estilo da tabela 2D

const TableView3D = ({ vertices, onVertexChange, onAddVertex, onRemoveVertex }) => {
  return (
    <div className="table-view-container">
      <h4>Vértices do Sólido 3D</h4>
      <table className="points-table">
        <thead>
          <tr>
            <th>Vértice</th>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vertices.map((v, index) => (
            <tr className="table-row" key={index}>
              <td>{index}</td>
              <td><input type="number" value={v.x} onChange={(e) => onVertexChange(index, 'x', e.target.value)} /></td>
              <td><input type="number" value={v.y} onChange={(e) => onVertexChange(index, 'y', e.target.value)} /></td>
              <td><input type="number" value={v.z} onChange={(e) => onVertexChange(index, 'z', e.target.value)} /></td>
              <td><button className="remove-btn" onClick={() => onRemoveVertex(index)}>Excluir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="run-button" onClick={onAddVertex}>Adicionar Vértice</button>
    </div>
  );
};

export default TableView3D;