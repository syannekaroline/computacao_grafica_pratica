import React from 'react';
import '../ParameterPanels.css';

const CohenSutherlandPanel = ({ setClipWindow, clipWindow, onApplyClip }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const intValue = parseInt(value, 10) || 0;

    // Lógica de validação para impedir min > max
    setClipWindow(prev => {
      const newWindow = { ...prev, [name]: intValue };
      if (name === 'xMin' && intValue >= newWindow.xMax) {
        newWindow.xMax = intValue + 1;
      }
      if (name === 'xMax' && intValue <= newWindow.xMin) {
        newWindow.xMin = intValue - 1;
      }
      if (name === 'yMin' && intValue >= newWindow.yMax) {
        newWindow.yMax = intValue + 1;
      }
      if (name === 'yMax' && intValue <= newWindow.yMin) {
        newWindow.yMin = intValue - 1;
      }
      return newWindow;
    });
  };

  return (
    <div className="parameter-panel">
      <h4>Janela de Recorte (Cohen-Sutherland)</h4>
      <div className="param-group">
        <label htmlFor="xMin">X Mínimo:</label>
        <input
          type="number"
          id="xMin"
          name="xMin"
          value={clipWindow.xMin}
          onChange={handleInputChange}
        />
      </div>
      <div className="param-group">
        <label htmlFor="yMin">Y Mínimo:</label>
        <input
          type="number"
          id="yMin"
          name="yMin"
          value={clipWindow.yMin}
          onChange={handleInputChange}
        />
      </div>
      <div className="param-group">
        <label htmlFor="xMax">X Máximo:</label>
        <input
          type="number"
          id="xMax"
          name="xMax"
          value={clipWindow.xMax}
          onChange={handleInputChange}
        />
      </div>
      <div className="param-group">
        <label htmlFor="yMax">Y Máximo:</label>
        <input
          type="number"
          id="yMax"
          name="yMax"
          value={clipWindow.yMax}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="info-text">
        <p>
          Desenhe uma ou mais retas com Bresenham. Em seguida, ajuste a janela de recorte e clique no botão abaixo para aplicar.
        </p>
      </div>
      <button className="run-button" onClick={onApplyClip}>
        Executar Recorte
      </button>
    </div>
  );
};

export default CohenSutherlandPanel;