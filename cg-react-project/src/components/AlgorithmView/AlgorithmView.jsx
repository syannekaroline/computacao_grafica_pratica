import React from 'react';
import './AlgorithmView.css';

const algorithms = [
  { id: 'bresenham', name: 'Bresenham' },
  { id: 'circle', name: 'Círculo' },
  { id: 'bezier', name: 'Curva de Bézier' },
];

function AlgorithmView({ selectedAlgorithm, onSelectAlgorithm }) {
  return (
    <div className="algorithm-view-container">
      <h3>Algoritmos de Rasterização</h3>
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