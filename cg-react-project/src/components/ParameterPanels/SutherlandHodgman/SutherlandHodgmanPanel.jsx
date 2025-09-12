import React from 'react';
import '../ParameterPanels.css';

const SutherlandHodgmanPanel = ({ clipWindow, setClipWindow, onApplyPolygonClip }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const intValue = parseInt(value, 10) || 0;

    // Lógica de validação e auto-ajuste adicionada
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
      <h4>Janela de Recorte (Sutherland-Hodgman)</h4>
      {/* Inputs para a janela de recorte */}
      <div className="param-group">
        <label htmlFor="polyXMin">X Mínimo:</label>
        <input
          type="number"
          id="polyXMin"
          name="xMin"
          value={clipWindow.xMin}
          onChange={handleInputChange}
        />
      </div>
      <div className="param-group">
        <label htmlFor="polyYMin">Y Mínimo:</label>
        <input
          type="number"
          id="polyYMin"
          name="yMin"
          value={clipWindow.yMin}
          onChange={handleInputChange}
        />
      </div>
      <div className="param-group">
        <label htmlFor="polyXMax">X Máximo:</label>
        <input
          type="number"
          id="polyXMax"
          name="xMax"
          value={clipWindow.xMax}
          onChange={handleInputChange}
        />
      </div>
      <div className="param-group">
        <label htmlFor="polyYMax">Y Máximo:</label>
        <input
          type="number"
          id="polyYMax"
          name="yMax"
          value={clipWindow.yMax}
          onChange={handleInputChange}
        />
      </div>

      <div className="info-text">
        <p>
          Desenhe um polígono usando o algoritmo "Polilinha/Polígono". Em seguida, ajuste a janela e clique para aplicar o recorte.
        </p>
      </div>
      <button className="run-button" onClick={onApplyPolygonClip}>
        Executar Recorte de Polígono
      </button>
    </div>
  );
};

export default SutherlandHodgmanPanel;