import React from 'react';
import '../ParameterPanels.css';

const EllipsePanel = ({ parameters, onParameterChange, onDrawAlgorithm }) => {
  const handlePointChange = (axis, value) => {
    const parsedValue = parseInt(value, 10) || 0;
    onParameterChange('center', { ...parameters.center, [axis]: parsedValue });
  };
  
  const handleRadiusChange = (axis, value) => {
    onParameterChange(axis, parseInt(value, 10) || 0);
  };

  return (
    <div className="parameter-panel">
      <h4>Parâmetros da Elipse</h4>
      
      <div className="param-group">
        <label>Centro (xc, yc):</label>
        <div className="point-inputs">
          <input type="number" value={parameters.center.x} onChange={(e) => handlePointChange('x', e.target.value)} />
          <input type="number" value={parameters.center.y} onChange={(e) => handlePointChange('y', e.target.value)} />
        </div>
      </div>

      <div className="param-group">
        <label>Raio X (a):</label>
        <input type="number" value={parameters.radiusA} onChange={(e) => handleRadiusChange('radiusA', e.target.value)} />
      </div>

      <div className="param-group">
        <label>Raio Y (b):</label>
        <input type="number" value={parameters.radiusB} onChange={(e) => handleRadiusChange('radiusB', e.target.value)} />
      </div>

      <button className="run-button" onClick={onDrawAlgorithm}>Desenhar Elipse</button>
    </div>
  );
};

export default EllipsePanel;