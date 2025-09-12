import React from 'react';
import '../ParameterPanels.css'; // Reutilizando o CSS existente

// As props agora recebem 'parameters' e 'onParameterChange' do App.jsx
function TransformationsPanel({ 
  parameters, 
  onParameterChange, 
  onTranslate, 
  onScale, 
  onRotate, 
  onReset 
}) {

  // Função para lidar com a mudança nos inputs aninhados
  const handleInputChange = (group, field) => (e) => {
    const value = parseFloat(e.target.value) || 0;
    const newGroupState = { ...parameters[group], [field]: value };
    onParameterChange(group, newGroupState);
  };
  
  return (
    <div className="parameter-panel">
      <h4>Transformações 2D</h4>
      <p>Desenhe uma polilinha para definir o objeto a ser transformado.</p>

      {/* --- Translação --- */}
      <div className="param-group">
        <label>Translação:</label>
        <div className="coord-inputs labeled-inputs"> {/* Adicionada classe para estilo */}
          <div className="input-group">
            <label>X:</label>
            <input type="number" value={parameters.translate.tx} onChange={handleInputChange('translate', 'tx')} />
          </div>
          <div className="input-group">
            <label>Y:</label>
            <input type="number" value={parameters.translate.ty} onChange={handleInputChange('translate', 'ty')} />
          </div>
        </div>
        <div className="button-container">
          <button className='run-button' onClick={onTranslate}>Aplicar Translação</button>
        </div>
      </div>

      {/* --- Escala --- */}
      <div className="param-group">
        <label>Fatores de Escala:</label>
        <div className="coord-inputs labeled-inputs">
          <div className="input-group">
            <label>SX:</label>
            <input type="number" step="0.1" value={parameters.scale.sx} onChange={handleInputChange('scale', 'sx')} />
          </div>
          <div className="input-group">
            <label>SY:</label>
            <input type="number" step="0.1" value={parameters.scale.sy} onChange={handleInputChange('scale', 'sy')} />
          </div>
        </div>
        <label>Ponto Fixo:</label>
        <div className="coord-inputs labeled-inputs">
          <div className="input-group">
            <label>X:</label>
            <input type="number" value={parameters.scale.fixedX} onChange={handleInputChange('scale', 'fixedX')} />
          </div>
          <div className="input-group">
            <label>Y:</label>
            <input type="number" value={parameters.scale.fixedY} onChange={handleInputChange('scale', 'fixedY')} />
          </div>
        </div>
        <div className="button-container">
          <button className='run-button' onClick={onScale}>Aplicar Escala</button>
        </div>
      </div>
      
      {/* --- Rotação --- */}
      <div className="param-group">
        <label>Rotação (Graus):</label>
        <div className="coord-inputs single-input">
            <input type="number" value={parameters.rotate.angle} onChange={handleInputChange('rotate', 'angle')} />
        </div>
        <label>Ponto Pivô:</label>
        <div className="coord-inputs labeled-inputs">
          <div className="input-group">
            <label>X:</label>
            <input type="number" value={parameters.rotate.pivotX} onChange={handleInputChange('rotate', 'pivotX')} />
          </div>
          <div className="input-group">
            <label>Y:</label>
            <input type="number" value={parameters.rotate.pivotY} onChange={handleInputChange('rotate', 'pivotY')} />
          </div>
        </div>
        <div className="button-container">
          <button className='run-button' onClick={onRotate}>Aplicar Rotação</button>
        </div>
      </div>
      
      <hr />
      
      <div className="param-group button-container">
        <button className='run-button' onClick={onReset}>Resetar Posição do Polígono</button>
      </div>
    </div>
  );
}

// NOVO: Adicione este export se ainda não existir
export { TransformationsPanel };