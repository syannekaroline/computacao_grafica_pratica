import React, { useState, useEffect, useRef, useCallback } from 'react';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';
import TopMenu from './components/TopMenu/TopMenu';
import './App.css';

function App() {
  const [activeSidebarMenu, setActiveSidebarMenu] = useState('ALGORITHMS');
  const [currentMode, setCurrentMode] = useState('SELECT');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bresenham');

  const [sidebarWidth, setSidebarWidth] = useState(300);
  const isResizingRef = useRef(false);
  const [drawnObjects, setDrawnObjects] = useState([]);

  const [points, setPoints] = useState([]);

  const [parameters, setParameters] = useState({
    bresenham: { p1: { x: 1, y: 2 }, p2: { x: 8, y: 5 } },
    circle: { center: { x: 5, y: 5 }, radius: 4 },
    bezier: {
      p0: { x: 2, y: 2 }, p1: { x: 4, y: 8 },
      p2: { x: 10, y: 9 }, p3: { x: 12, y: 3 },
    },
    floodFill: { seed: { x: 3, y: 3 } },
  });

  const handleParameterChange = (algorithm, paramName, value) => {
    setParameters(prevParams => ({
      ...prevParams,
      [algorithm]: { ...prevParams[algorithm], [paramName]: value },
    }));
  };

  const handleReset = () => {
    setDrawnObjects([]);
    setPoints([]); // Também limpa os pontos da tabela
  };

  const handleMouseDown = (e) => { e.preventDefault(); isResizingRef.current = true; };
  const handleMouseMove = useCallback((e) => {
    if (isResizingRef.current) {
      setSidebarWidth(Math.min(Math.max(e.clientX, 280), 600));
    }
  }, []);
  const handleMouseUp = useCallback(() => { isResizingRef.current = false; }, []);

  const handleDrawAlgorithm = () => {
    let newObject = null;
    const commonProps = { id: `${selectedAlgorithm}-${Date.now()}` };

    switch (selectedAlgorithm) {
      case 'bresenham':
        newObject = { ...commonProps, type: 'bresenham', params: { ...parameters.bresenham }, color: '#5d1cc5' };
        break;
      case 'circle':
        newObject = { ...commonProps, type: 'circle', params: { ...parameters.circle }, color: '#5d1cc5' };
        break;
      case 'bezier':
        newObject = { ...commonProps, type: 'bezier', params: { ...parameters.bezier }, color: '#5d1cc5' };
        break;
      case 'polyline':
        if (points.length < 2) {
          alert("Para desenhar um polígono, adicione pelo menos 2 pontos na Tabela de Pontos.");
          return;
        }
        newObject = { ...commonProps, type: 'polyline', params: { points: [...points] }, color: '#000000' };
        break;
      case 'scanlineFill':
        if (points.length < 3) {
          alert("Para preencher com Varredura, o polígono precisa de pelo menos 3 pontos.");
          return;
        }
        newObject = { ...commonProps, type: 'scanlineFill', params: { points: [...points] }, color: '#e74c3c' };
        break;
      case 'floodFill':
        newObject = { ...commonProps, type: 'floodFill', params: { ...parameters.floodFill }, color: '#3498db' };
        break;
      default:
        return;
    }
    setDrawnObjects(prev => [...prev, newObject]);
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
      <TopMenu currentMode={currentMode} onModeChange={setCurrentMode} onReset={handleReset} />
      <div className="main-content">
        <div style={{ width: `${sidebarWidth}px`, flexShrink: 0 }}>
          <Sidebar
            activeMenu={activeSidebarMenu} onMenuChange={setActiveSidebarMenu}
            points={points} onPointChange={handlePointChange} onAddPoint={handleAddPoint} onRemovePoint={handleRemovePoint}
            selectedAlgorithm={selectedAlgorithm} onSelectAlgorithm={setSelectedAlgorithm}
            parameters={parameters} onParameterChange={handleParameterChange}
            onDrawAlgorithm={handleDrawAlgorithm}
          />
        </div>
        <div className="resizer" onMouseDown={handleMouseDown} />
        <div className="canvas-container">
          {/* CORREÇÃO: Adicionadas as propriedades que faltavam */}
          <Canvas
            drawnObjects={drawnObjects}
            points={points}
            parameters={parameters}
            selectedAlgorithm={selectedAlgorithm}
          />
        </div>
      </div>
    </div>
  );
}

export default App;