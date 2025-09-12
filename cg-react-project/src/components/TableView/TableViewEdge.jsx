import React from 'react';
import './TableView.css'; // Reutiliza o mesmo estilo das outras tabelas

const TableViewEdges = ({ edges, onEdgeChange, onAddEdge, onRemoveEdge }) => {
  return (
    <div className="table-view-container">
      <h4>Arestas do Sólido (Conexões)</h4>
      <table className="points-table">
        <thead>
          <tr>
            <th>Aresta</th>
            <th>Do Vértice</th>
            <th>Para Vértice</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {edges.map((edge, index) => (
            <tr className="table-row" key={index}>
              <td>{index}</td>
              {/* Input para o primeiro vértice da aresta */}
              <td>
                <input 
                  type="number" 
                  value={edge[0]} 
                  onChange={(e) => onEdgeChange(index, 0, e.target.value)} 
                />
              </td>
              {/* Input para o segundo vértice da aresta */}
              <td>
                <input 
                  type="number" 
                  value={edge[1]} 
                  onChange={(e) => onEdgeChange(index, 1, e.target.value)} 
                />
              </td>
              <td>
                <button className="remove-btn" onClick={() => onRemoveEdge(index)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="run-button" onClick={onAddEdge}>Adicionar Aresta</button>
    </div>
  );
};

export default TableViewEdges;