import React from 'react';
import './AlgorithmView.css';

// CORREÇÃO: A lista de algoritmos volta a ser definida aqui dentro.
// Isso torna o componente autossuficiente e corrige o erro.
const algorithms = [
  { id: 'bresenham', name: 'Bresenham' },
  // Outros algoritmos serão adicionados aqui no futuro...
];

// A prop 'algorithms' foi removida da lista de parâmetros da função
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