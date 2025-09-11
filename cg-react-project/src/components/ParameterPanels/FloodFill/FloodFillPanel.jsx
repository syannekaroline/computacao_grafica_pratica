// src/components/ParameterPanels/FloodFill/FloodFillPanel.jsx
import React from 'react';
import '../ParameterPanels.css';

function FloodFillPanel({ parameters, onParameterChange, onDrawAlgorithm }) {
  return (
    <div className="param-panel-container">
      <h4>Parâmetros de Preenchimento</h4>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Este algoritmo preenche uma área a partir de um ponto inicial (semente).
        Desenhe um polígono primeiro, depois selecione um ponto dentro dele e clique em preencher.
      </p>
      <div className="param-group">
        <label>Ponto Semente (X, Y)</label>
        <div className="point-inputs">
          <input
            type="number"
            value={parameters.seed.x}
            onChange={(e) => onParameterChange('floodFill', 'seed', { ...parameters.seed, x: parseFloat(e.target.value) || 0 })}
          />
          <input
            type="number"
            value={parameters.seed.y}
            onChange={(e) => onParameterChange('floodFill', 'seed', { ...parameters.seed, y: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      <button className="run-button" onClick={onDrawAlgorithm}>Preencher Área</button>
    </div>
  );
}

export default FloodFillPanel;