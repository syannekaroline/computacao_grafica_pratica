import React from 'react';
import './BresenhamPanel.css';

function BresenhamPanel({ parameters, onParameterChange }) {
  // Por enquanto, as funções de 'onChange' apenas chamam a função
  // principal, sem a lógica complexa.
  return (
    <div className="param-panel-container">
      <h4>Parâmetros de Bresenham</h4>
      
      <div className="param-group">
        <label>Ponto 1 (X₀, Y₀)</label>
        <div className="point-inputs">
          <input 
            type="number" 
            value={parameters.p1.x}
            onChange={(e) => onParameterChange('bresenham', 'p1', { ...parameters.p1, x: e.target.value })} 
          />
          <input 
            type="number" 
            value={parameters.p1.y}
            onChange={(e) => onParameterChange('bresenham', 'p1', { ...parameters.p1, y: e.target.value })} 
          />
        </div>
      </div>

      <div className="param-group">
        <label>Ponto 2 (X₁, Y₁)</label>
        <div className="point-inputs">
          <input 
            type="number" 
            value={parameters.p2.x}
            onChange={(e) => onParameterChange('bresenham', 'p2', { ...parameters.p2, x: e.target.value })} 
          />
          <input 
            type="number" 
            value={parameters.p2.y}
            onChange={(e) => onParameterChange('bresenham', 'p2', { ...parameters.p2, y: e.target.value })}
          />
        </div>
      </div>

      <div className="param-group">
        <label htmlFor="bresenham-color">Cor</label>
        <input 
          type="color" 
          id="bresenham-color"
          value={parameters.color}
          onChange={(e) => onParameterChange('bresenham', 'color', e.target.value)}
        />
      </div>

      <button className="run-button">Desenhar Reta</button>
    </div>
  );
}

export default BresenhamPanel;