import React, { useState, useEffect, useRef, useCallback } from 'react';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';
import TopMenu from './components/TopMenu/TopMenu';
import './App.css';

function App() {
  const [activeSidebarMenu, setActiveSidebarMenu] = useState('ALGORITHMS');
  const [currentMode, setCurrentMode] = useState('SELECT');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bresenham');

  const [sidebarWidth, setSidebarWidth] = useState(280);
  const isResizingRef = useRef(false);
  const [drawnObjects, setDrawnObjects] = useState([]);

  // --- Seção de Pontos da Tabela ---
  const [points, setPoints] = useState([]);

  const [parameters, setParameters] = useState({
    bresenham: { p1: { x: 1, y: 2 }, p2: { x: 8, y: 5 } },
    circle: { center: { x: 5, y: 5 }, radius: 4 },
    bezier: {
      p0: { x: 2, y: 2 },
      p1: { x: 4, y: 8 },
      p2: { x: 10, y: 9 },
      p3: { x: 12, y: 3 },
    },
  });

  const handleParameterChange = (algorithm, paramName, value) => {
    setParameters(prevParams => ({
      ...prevParams,
      [algorithm]: {
        ...prevParams[algorithm],
        [paramName]: value,
      },
    }));
  };

  const handleReset = () => {
    setDrawnObjects([]);
  };

  const handleMouseDown = (e) => { e.preventDefault(); isResizingRef.current = true; };
  const handleMouseMove = useCallback((e) => {
    if (isResizingRef.current) {
      const newWidth = Math.min(Math.max(e.clientX, 240), 600);
      setSidebarWidth(newWidth);
    }
  }, []);
  const handleMouseUp = useCallback(() => { isResizingRef.current = false; }, []);

  const handleDrawAlgorithm = () => {
    if (selectedAlgorithm === 'bresenham') {
      const newObject = {
        id: `bresenham-${Date.now()}`,
        type: 'bresenham',
        params: { ...parameters.bresenham },
        color: '#5d1cc5',
      };
      setDrawnObjects(prevObjects => [...prevObjects, newObject]);
    } else if (selectedAlgorithm === 'circle') {
      const newObject = {
        id: `circle-${Date.now()}`,
        type: 'circle',
        params: { ...parameters.circle },
        color: '#e22d2d',
      };
      setDrawnObjects(prevObjects => [...prevObjects, newObject]);
    } else if (selectedAlgorithm === 'bezier') {
      const newObject = {
        id: `bezier-${Date.now()}`,
        type: 'bezier',
        params: { ...parameters.bezier },
        color: '#5d1cc5ff', // Cor fixa definida aqui
      };
      setDrawnObjects(prevObjects => [...prevObjects, newObject]);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handlePointChange = (index, axis, value) => {
    const newPoints = [...points];
    newPoints[index][axis] = parseFloat(value) || 0;
    setPoints(newPoints);
  };
  const handleAddPoint = () => setPoints([...points, { x: 0, y: 0 }]);
  const handleRemovePoint = (index) => setPoints(points.filter((_, i) => i !== index));

  return (
    <div className="app-container">
      <TopMenu
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        onReset={handleReset}
      />
      <div className="main-content">
        <div style={{ width: `${sidebarWidth}px`, flexShrink: 0, backgroundColor: '#fff' }}>
          <Sidebar
            activeMenu={activeSidebarMenu}
            onMenuChange={setActiveSidebarMenu}
            points={points}
            onPointChange={handlePointChange}
            onAddPoint={handleAddPoint}
            onRemovePoint={handleRemovePoint}
            selectedAlgorithm={selectedAlgorithm}
            onSelectAlgorithm={setSelectedAlgorithm}
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onDrawAlgorithm={handleDrawAlgorithm}
          />
        </div>
        <div className="resizer" onMouseDown={handleMouseDown} />
        <div className="canvas-container">
          <Canvas
            points={points}
            parameters={parameters}
            selectedAlgorithm={selectedAlgorithm}
            drawnObjects={drawnObjects}
          />
        </div>
      </div>
    </div>
  );
}

export default App;