import React from 'react';
import '../ParameterPanels.css';

const ProjectionsPanel = ({ type, params, onTypeChange, onParamsChange, onProject }) => {
  const handleParam = (param, value) => {
    onParamsChange(param, parseFloat(value));
  };
  
  const handleVpChange = (num) => {
    onParamsChange('numVanishingPoints', parseInt(num));
  };

  return (
    <div className="parameter-panel">
      <h4>Projeções 3D</h4>
      <div className="param-group">
        <label>Tipo de Projeção:</label>
        <select value={type} onChange={(e) => onTypeChange(e.target.value)}>
          <option value="cavalier">Cavalier</option>
          <option value="cabinet">Cabinet</option>
          <option value="perspective">Perspectiva</option>
        </select>
      </div>

      {/* Parâmetros para Projeções Oblíquas */}
      {(type === 'cavalier' || type === 'cabinet') && (
        <div className="param-group">
          <label>Ângulo (θ): {params.angle}°</label>
          <input 
            type="range" min="0" max="90" 
            value={params.angle} 
            onChange={(e) => handleParam('angle', e.target.value)} 
          />
        </div>
      )}

      {/* Parâmetros para Projeção em Perspectiva */}
      {type === 'perspective' && (
        <>
          <div className="param-group">
            <label>Pontos de Fuga:</label>
            <div className="radio-group">
              <label><input type="radio" name="vp" value={1} checked={params.numVanishingPoints === 1} onChange={(e) => handleVpChange(e.target.value)} /> 1</label>
              <label><input type="radio" name="vp" value={2} checked={params.numVanishingPoints === 2} onChange={(e) => handleVpChange(e.target.value)} /> 2</label>
              <label><input type="radio" name="vp" value={3} checked={params.numVanishingPoints === 3} onChange={(e) => handleVpChange(e.target.value)} /> 3</label>
            </div>
          </div>
          
          {/* --- CORREÇÃO APLICADA AQUI --- */}
          {/* O valor mínimo foi aumentado para evitar coordenadas muito grandes */}
          {params.numVanishingPoints >= 1 && (
            <div className="param-group">
              <label>Dist. Ponto Fuga Z (dz): {params.dz}</label>
              <input type="range" min="1" max="500" value={params.dz} onChange={(e) => handleParam('dz', e.target.value)} />
            </div>
          )}
          {params.numVanishingPoints >= 2 && (
            <div className="param-group">
              <label>Dist. Ponto Fuga X (dx): {params.dx}</label>
              <input type="range" min="1" max="500" value={params.dx} onChange={(e) => handleParam('dx', e.target.value)} />
            </div>
          )}
          {params.numVanishingPoints === 3 && (
            <div className="param-group">
              <label>Dist. Ponto Fuga Y (dy): {params.dy}</label>
              <input type="range" min="1" max="500" value={params.dy} onChange={(e) => handleParam('dy', e.target.value)} />
            </div>
          )}
        </>
      )}

      <div className="info-text">
        <p>Use a Tabela de Vértices 3D para definir seu sólido. As arestas de um cubo serão usadas por padrão.</p>
      </div>
      <button className="run-button" onClick={onProject}>Projetar Sólido</button>
    </div>
  );
};

export default ProjectionsPanel;