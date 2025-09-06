import React from 'react';
import './SidebarPanel.css';
import TableView from '../TableView/TableView';
import AlgorithmView from '../AlgorithmView/AlgorithmView';
import BresenhamPanel from '../ParameterPanels/Bresenham/BresenhamPanel';
import CirclePanel from '../ParameterPanels/Circle/CirclePanel';
import BezierPanel from '../ParameterPanels/Bezier/BezierPanel';

function SidebarPanel(props) {
  const {
    activeMenu,
    selectedAlgorithm,
    onSelectAlgorithm,
    parameters,
    onParameterChange,
    onDrawAlgorithm,
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
          </div>
        </>
      )}

      {activeMenu === 'TRANSFORMS' && (
        <div>
          <h3>Transformações Geométricas</h3>
        </div>
      )}

      {activeMenu === 'TABLE' && (
        <TableView {...tableViewProps} />
      )}
    </div>
  );
}

export default SidebarPanel;