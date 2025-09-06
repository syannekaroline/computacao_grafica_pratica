import React from 'react';
import '../ParameterPanels.css';

function BresenhamPanel({ parameters, onParameterChange, onDrawAlgorithm }) {
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
            onChange={(e) => onParameterChange('bresenham', 'p1', { ...parameters.p1, x: parseFloat(e.target.value) || 0 })} 
          />
          <input 
            type="number" 
            value={parameters.p1.y}
            onChange={(e) => onParameterChange('bresenham', 'p1', { ...parameters.p1, y: parseFloat(e.target.value) || 0 })} 
          />
        </div>
      </div>

      <div className="param-group">
        <label>Ponto 2 (X₁, Y₁)</label>
        <div className="point-inputs">
          <input 
            type="number" 
            value={parameters.p2.x}
            onChange={(e) => onParameterChange('bresenham', 'p2', { ...parameters.p2, x: parseFloat(e.target.value) || 0 })} 
          />
          <input 
            type="number" 
            value={parameters.p2.y}
            onChange={(e) => onParameterChange('bresenham', 'p2', { ...parameters.p2, y: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>  

      <button className="run-button" onClick={onDrawAlgorithm}>Desenhar Reta</button>
    </div>
  );
}

export default BresenhamPanel;