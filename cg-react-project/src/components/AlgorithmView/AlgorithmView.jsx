import React from 'react';
import './AlgorithmView.css';

const algorithms = [
  { id: 'bresenham', name: 'Bresenham' },
  { id: 'circle', name: 'Círculo' },
  { id: 'bezier', name: 'Curva de Bézier' },
  { id: 'polyline', name: 'Polilinha/Polígono' },
  { id: 'floodFill', name: 'Preenchimento Recursivo' },
  { id: 'scanlineFill', name: 'Preenchimento por Varredura' },
  { id: 'cohenSutherland', name: 'Recorte de Linha' },
  { id: 'sutherlandHodgman', name: 'Recorte de Polígono' },
  { id: 'projections', name: 'Projeções 3D' }
];

function AlgorithmView({ selectedAlgorithm, onSelectAlgorithm }) {
  return (
    <div className="algorithm-view-container">
      <h3>Algoritmos</h3>
      <ul className="algorithm-list">
        {algorithms.map((algo) => (
          <li key={algo.id}>
            <button
              className={`algorithm-button ${selectedAlgorithm === algo.id ? 'active' : ''}`}
              onClick={() => onSelectAlgorithm(algo.id)}
            >
              {algo.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlgorithmView;