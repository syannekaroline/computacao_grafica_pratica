import React from 'react';
import './AlgorithmView.css';

const algorithms = [
  { id: 'bresenham', name: 'Bresenham' },
  // Futuramente: { id: 'circle', name: 'Círculo' },
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