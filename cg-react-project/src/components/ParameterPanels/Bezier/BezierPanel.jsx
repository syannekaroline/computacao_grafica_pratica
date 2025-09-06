import React from 'react';
import '../ParameterPanels.css'; // Reutilizando o CSS geral

function BezierPanel({ parameters, onParameterChange, onDrawAlgorithm }) {
  const handlePointChange = (pointName, axis, value) => {
    const updatedPoint = { ...parameters[pointName], [axis]: parseFloat(value) || 0 };
    onParameterChange('bezier', pointName, updatedPoint);
  };

  return (
    <div className="param-panel-container">
      <h4>Parâmetros da Curva de Bézier</h4>

      <div className="param-group">
        <label>Ponto Inicial (P₀)</label>
        <div className="point-inputs">
          <input type="number" value={parameters.p0.x} onChange={(e) => handlePointChange('p0', 'x', e.target.value)} />
          <input type="number" value={parameters.p0.y} onChange={(e) => handlePointChange('p0', 'y', e.target.value)} />
        </div>
      </div>

      <div className="param-group">
        <label>Controle 1 (P₁)</label>
        <div className="point-inputs">
          <input type="number" value={parameters.p1.x} onChange={(e) => handlePointChange('p1', 'x', e.target.value)} />
          <input type="number" value={parameters.p1.y} onChange={(e) => handlePointChange('p1', 'y', e.target.value)} />
        </div>
      </div>

      <div className="param-group">
        <label>Controle 2 (P₂)</label>
        <div className="point-inputs">
          <input type="number" value={parameters.p2.x} onChange={(e) => handlePointChange('p2', 'x', e.target.value)} />
          <input type="number" value={parameters.p2.y} onChange={(e) => handlePointChange('p2', 'y', e.target.value)} />
        </div>
      </div>

      <div className="param-group">
        <label>Ponto Final (P₃)</label>
        <div className="point-inputs">
          <input type="number" value={parameters.p3.x} onChange={(e) => handlePointChange('p3', 'x', e.target.value)} />
          <input type="number" value={parameters.p3.y} onChange={(e) => handlePointChange('p3', 'y', e.target.value)} />
        </div>
      </div>

      <button className="run-button" onClick={onDrawAlgorithm}>Desenhar Curva</button>
    </div>
  );
}

export default BezierPanel;