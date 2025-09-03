// src/App.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';
import TopMenu from './components/TopMenu/TopMenu';
import './App.css';

function App() {
  // --- ESTADO CENTRAL DA APLICAÇÃO ---
  const [activeSidebarMenu, setActiveSidebarMenu] = useState('ALGORITHMS');
  const [currentMode, setCurrentMode] = useState('SELECT_ALGORITHM');

  // --- Seção de Lógica do Redimensionamento ---
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const isResizingRef = useRef(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isResizingRef.current = true;
  };

  const handleMouseMove = useCallback((e) => {
    if (isResizingRef.current) {
      const newWidth = Math.min(Math.max(e.clientX, 240), 600);
      setSidebarWidth(newWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizingRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // --- Seção de Parâmetros dos Algoritmos ---
  const [parameters, setParameters] = useState({
    bresenham: { p1: { x: 1, y: 2 }, p2: { x: 8, y: 5 }, color: '#FF0000' },
    circle: { center: { x: 0, y: 0 }, radius: 5, color: '#0000FF' },
    transform: {
      translateX: 0,
      translateY: 0,
      scale: 1,
      rotationAngle: 0,
      rotationPivot: { x: 0, y: 0 },
    },
  });

  // --- Seção de Pontos da Tabela ---
  const [points, setPoints] = useState([
    { x: 2, y: 3 },
    { x: 5, y: -1 },
    { x: -4, y: 4 },
  ]);

  // --- FUNÇÃO CORRIGIDA ---
  const handlePointChange = (index, axis, value) => {
    const newPoints = [...points];
    // Converte o valor para número. Se o campo estiver vazio, considera 0.
    newPoints[index][axis] = parseFloat(value) || 0;
    setPoints(newPoints);
  };

  const handleAddPoint = () => {
    setPoints([...points, { x: 0, y: 0 }]);
  };

  const handleRemovePoint = (index) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
  };

  const handleParameterChange = (algorithm, paramName, value) => {
    setParameters((prevParams) => ({
      ...prevParams,
      [algorithm]: {
        ...prevParams[algorithm],
        [paramName]: value,
      },
    }));
  };

  // --- ESTRUTURA VISUAL / LAYOUT ---
  return (
    <div className="app-container">
      <TopMenu currentMode={currentMode} onModeChange={setCurrentMode} />
      <div className="main-content">
        <div style={{ width: `${sidebarWidth}px`, flexShrink: 0, backgroundColor: '#fff' }}>
          <Sidebar
            activeMenu={activeSidebarMenu}
            onMenuChange={setActiveSidebarMenu}
            currentMode={currentMode}
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onModeChange={setCurrentMode}
            points={points}
            onPointChange={handlePointChange}
            onAddPoint={handleAddPoint}
            onRemovePoint={handleRemovePoint}
          />
        </div>
        <div className="resizer" onMouseDown={handleMouseDown} />
        <Canvas currentMode={currentMode} parameters={parameters} points={points} />
      </div>
    </div>
  );
}

export default App;