// src/components/ParameterPanels/Scanline/ScanlineFillPanel.jsx
import React from 'react';
import '../ParameterPanels.css';

function ScanlineFillPanel({ onDrawAlgorithm, onMenuChange }) {
    return (
        <div className="param-panel-container">
            <h4>Preenchimento por Varredura</h4>
            <p className="placeholder-text">
                Este algoritmo preenche um polígono fechado. Use a <a href="#" onClick={() => onMenuChange('TABLE')}>Tabela de Pontos</a> para definir os vértices do polígono.
            </p>
            <button className="run-button" onClick={onDrawAlgorithm}>Preencher Polígono</button>
        </div>
    );
}

export default ScanlineFillPanel;