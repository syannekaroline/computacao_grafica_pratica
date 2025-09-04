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

  // --- Seção de Pontos da Tabela ---
  const [points, setPoints] = useState([]);
    
  // add no commit de add dos parametros do bresenham
   const [parameters, setParameters] = useState({
    bresenham: { p1: { x: 1, y: 2 }, p2: { x: 8, y: 5 }, color: '#FF0000' },
     // Futuramente, outros algoritmos virão aqui
    });
    // Por enquanto, esta função não fará nada, mas é necessária para os inputs
    const handleParameterChange = (algorithm, paramName, value) => {
        console.log("Parâmetro alterado:", { algorithm, paramName, value });
    };

  const handleMouseDown = (e) => { e.preventDefault(); isResizingRef.current = true; };
  const handleMouseMove = useCallback((e) => {
    if (isResizingRef.current) {
      const newWidth = Math.min(Math.max(e.clientX, 240), 600);
      setSidebarWidth(newWidth);
    }
  }, []);
  const handleMouseUp = useCallback(() => { isResizingRef.current = false; }, []);

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
      <TopMenu currentMode={currentMode} onModeChange={setCurrentMode} />
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
          />
        </div>
        <div className="resizer" onMouseDown={handleMouseDown} />
        <div className="canvas-container">
          <Canvas points={points} />
        </div>
      </div>
    </div>
  );
}

export default App;