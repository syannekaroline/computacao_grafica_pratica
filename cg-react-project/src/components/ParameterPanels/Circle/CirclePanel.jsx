import React from 'react';
import '../ParameterPanels.css'; 

function CirclePanel({ parameters, onParameterChange, onDrawAlgorithm }) {
  return (
    <div className="param-panel-container">
      <h4>Parâmetros do Círculo</h4>

      <div className="param-group">
        <label>Centro (X₀, Y₀)</label>
        <div className="point-inputs">
          <input
            type="number"
            value={parameters.center.x}
            onChange={(e) => onParameterChange('circle', 'center', { ...parameters.center, x: parseFloat(e.target.value) || 0 })}
          />
          <input
            type="number"
            value={parameters.center.y}
            onChange={(e) => onParameterChange('circle', 'center', { ...parameters.center, y: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="param-group">
        <label>Raio</label>
        <input
          type="number"
          value={parameters.radius}
          onChange={(e) => onParameterChange('circle', 'radius', parseFloat(e.target.value) || 0)}
        />
      </div>

      <button className="run-button" onClick={onDrawAlgorithm}>Desenhar Círculo</button>
    </div>
  );
}

export default CirclePanel;