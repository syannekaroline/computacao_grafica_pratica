import React from 'react';
import './SidebarPanel.css';
import TableView from '../TableView/TableView';
import AlgorithmView from '../AlgorithmView/AlgorithmView';
import BresenhamPanel from '../ParameterPanels/Bresenham/BresenhamPanel';
import CirclePanel from '../ParameterPanels/Circle/CirclePanel';
import BezierPanel from '../ParameterPanels/Bezier/BezierPanel';
import FloodFillPanel from '../ParameterPanels/FloodFill/FloodFillPanel';
import ScanlineFillPanel from '../ParameterPanels/Scanline/ScanlineFillPanel';
import { TransformationsPanel } from '../ParameterPanels/Transformations/TransformationsPanel';


function PolylinePanel({ onDrawAlgorithm, onMenuChange }) {
    return (
        <div className="param-panel-container">
            <h4>Parâmetros da Polilinha</h4>
            <p className="placeholder-text">
                Use a <a href="#" onClick={() => onMenuChange('TABLE')}>Tabela de Pontos</a> para adicionar os vértices da polilinha.
            </p>
            <button className="run-button" onClick={onDrawAlgorithm}>Desenhar Polilinha</button>
        </div>
    );
}

function SidebarPanel(props) {
  const {
    activeMenu,
    selectedAlgorithm,
    onSelectAlgorithm,
    parameters,
    onParameterChange,
    onDrawAlgorithm,
    onMenuChange,
    onApplyTranslate,
    onApplyScale,
    onApplyRotate,
    onResetPolygon,
    ...tableViewProps
  } = props;

  return (
    <div className="sidebar-panel">
      {activeMenu === 'ALGORITHMS' && (
        <>
          <AlgorithmView
            selectedAlgorithm={selectedAlgorithm}
            onSelectAlgorithm={onSelectAlgorithm}
          />
          <div className="parameter-area">
            {selectedAlgorithm === 'bresenham' && (
              <BresenhamPanel
                parameters={parameters.bresenham}
                onParameterChange={onParameterChange}
                onDrawAlgorithm={onDrawAlgorithm}
              />
            )}
            {selectedAlgorithm === 'circle' && (
              <CirclePanel
                parameters={parameters.circle}
                onParameterChange={onParameterChange}
                onDrawAlgorithm={onDrawAlgorithm}
              />
            )}
            {selectedAlgorithm === 'bezier' && (
              <BezierPanel
                parameters={parameters.bezier}
                onParameterChange={onParameterChange}
                onDrawAlgorithm={onDrawAlgorithm}
              />
            )}
            {selectedAlgorithm === 'polyline' && (
                <PolylinePanel
                    onDrawAlgorithm={onDrawAlgorithm}
                    onMenuChange={onMenuChange}
                />
            )}
            {selectedAlgorithm === 'floodFill' && (
              <FloodFillPanel
                parameters={parameters.floodFill}
                onParameterChange={onParameterChange}
                onDrawAlgorithm={onDrawAlgorithm}
              />
            )}
            {selectedAlgorithm === 'scanlineFill' && (
              <ScanlineFillPanel
                onDrawAlgorithm={onDrawAlgorithm}
                onMenuChange={onMenuChange}
              />
            )}
          </div>
        </>
      )}

      {activeMenu === 'TRANSFORMS' && (
        <div className="parameter-area">
          <TransformationsPanel
            parameters={parameters.transformations}
            onParameterChange={(group, value) => onParameterChange('transformations', group, value)}
            onTranslate={onApplyTranslate}
            onScale={onApplyScale}
            onRotate={onApplyRotate}
            onReset={onResetPolygon}
          />
        </div>
      )}

      {activeMenu === 'TABLE' && (
        <TableView {...tableViewProps} />
      )}
    </div>
  );
}

export default SidebarPanel;