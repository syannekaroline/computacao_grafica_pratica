import React, { useState, useEffect, useRef, useCallback } from 'react';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';
import TopMenu from './components/TopMenu/TopMenu';
import { translate, rotate, scale } from './algorithms/transformations';
import { cohenSutherlandClip } from './algorithms/cohenSutherland';
import { calculateBresenhamLine } from './algorithms/bresenham';
import './App.css';

const INITIAL_POLYGON = [
  { x: 10, y: 10 }, { x: 15, y: 15 }, { x: 10, y: 20 }, { x: 5, y: 15 }
];

function App() {
  const [activeSidebarMenu, setActiveSidebarMenu] = useState('ALGORITHMS');
  const [currentMode, setCurrentMode] = useState('SELECT');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bresenham');

  const [sidebarWidth, setSidebarWidth] = useState(300);
  const isResizingRef = useRef(false);
  const [drawnObjects, setDrawnObjects] = useState([]);
  const [points, setPoints] = useState([]);

  const [basePolygon, setBasePolygon] = useState(INITIAL_POLYGON);
  const [transformedPolygon, setTransformedPolygon] = useState(INITIAL_POLYGON);

  const [clipWindow, setClipWindow] = useState({ xMin: 0, yMin: 0, xMax: 10, yMax: 10 });

  const [parameters, setParameters] = useState({
    bresenham: { p1: { x: 1, y: 2 }, p2: { x: 8, y: 5 } },
    circle: { center: { x: 5, y: 5 }, radius: 4 },
    bezier: {
      p0: { x: 2, y: 2 }, p1: { x: 4, y: 8 },
      p2: { x: 10, y: 9 }, p3: { x: 12, y: 3 },
    },
    floodFill: { seed: { x: 3, y: 3 } },
    transformations: {
      translate: { tx: 5, ty: 5 },
      scale: { sx: 1.2, sy: 1.2, fixedX: 10, fixedY: 10 },
      rotate: { angle: 30, pivotX: 10, pivotY: 10 },
    }
  });

  const handleParameterChange = (algorithm, paramName, value) => {
    if (algorithm === 'transformations') {
        setParameters(prevParams => ({
            ...prevParams,
            transformations: { ...prevParams.transformations, [paramName]: value }
        }));
    } else {
        setParameters(prevParams => ({
            ...prevParams,
            [algorithm]: { ...prevParams[algorithm], [paramName]: value }
        }));
    }
  };

  const handleReset = () => {
    setDrawnObjects([]);
    setPoints([]);
    setBasePolygon(INITIAL_POLYGON);
    setTransformedPolygon(INITIAL_POLYGON);
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
        const { p1, p2 } = parameters.bresenham;
        const pixels = calculateBresenhamLine(p1, p2);
        newObject = { ...commonProps, type: 'bresenham', params: { ...parameters.bresenham }, color: '#5d1cc5', pixels: pixels };
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
        setBasePolygon([...points]);
        setTransformedPolygon([...points]);
        break;
      
      // --- LÓGICA RESTAURADA ---
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
      // --- FIM DA LÓGICA RESTAURADA ---
        
      default:
        return;
    }
    setDrawnObjects(prev => [...prev, newObject]);
  };

  const handleApplyClip = () => {
    const { xMin, yMin, xMax, yMax } = clipWindow;

    if (xMin >= xMax || yMin >= yMax) {
      alert("Erro: Os valores mínimos da janela de recorte devem ser menores que os valores máximos.");
      return;
    }

    const updatedObjects = drawnObjects
      .map(obj => {
        if (obj.type === 'bresenham') {
          const { p1, p2 } = obj.params;
          const clippedEndpoints = cohenSutherlandClip(p1.x, p1.y, p2.x, p2.y, xMin, yMin, xMax, yMax);
          
          if (!clippedEndpoints) {
            return null;
          }

          const filteredPixels = obj.pixels.filter(p => 
            p.x >= xMin && p.x < xMax && p.y >= yMin && p.y < yMax
          );

          if (filteredPixels.length > 0) {
            return { 
                ...obj, 
                pixels: filteredPixels,
                params: { 
                  p1: { x: clippedEndpoints.x1, y: clippedEndpoints.y1 }, 
                  p2: { x: clippedEndpoints.x2, y: clippedEndpoints.y2 } 
                }
            };
          }
          return null;
        }
        return obj;
      })
      .filter(obj => obj !== null);

    setDrawnObjects(updatedObjects);
  };

  const handleApplyTranslate = () => {
    const { tx, ty } = parameters.transformations.translate;
    const newVertices = translate(transformedPolygon, tx, ty);
    setTransformedPolygon(newVertices);
  };
  
  const handleApplyScale = () => {
    const { sx, sy, fixedX, fixedY } = parameters.transformations.scale;
    const fixedPoint = { x: fixedX, y: fixedY };

    const isFixedPointVertex = transformedPolygon.some(
      vertex => Math.round(vertex.x) === fixedPoint.x && Math.round(vertex.y) === fixedPoint.y
    );

    if (!isFixedPointVertex) {
      alert('O ponto fixo escolhido deve ser um dos vértices do polígono!');
      return;
    }
    
    const newVertices = scale(transformedPolygon, sx, sy, fixedPoint);
    setTransformedPolygon(newVertices);
  };

  const handleApplyRotate = () => {
    const { angle, pivotX, pivotY } = parameters.transformations.rotate;
    const pivot = { x: pivotX, y: pivotY };

    const isPivotVertex = transformedPolygon.some(
      vertex => Math.round(vertex.x) === pivot.x && Math.round(vertex.y) === pivot.y
    );

    if (!isPivotVertex) {
      alert('O pivô escolhido deve ser um dos vértices do polígono!');
      return;
    }
    
    const newVertices = rotate(transformedPolygon, angle, pivot);
    setTransformedPolygon(newVertices);
  };

  const handleResetPolygon = () => {
    setTransformedPolygon(basePolygon);
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
            onApplyTranslate={handleApplyTranslate}
            onApplyScale={handleApplyScale}
            onApplyRotate={handleApplyRotate}
            onResetPolygon={handleResetPolygon}
            clipWindow={clipWindow}
            setClipWindow={setClipWindow}
            onApplyClip={handleApplyClip}
          />
        </div>
        <div className="resizer" onMouseDown={handleMouseDown} />
        <div className="canvas-container">
          <Canvas
            drawnObjects={drawnObjects}
            points={points}
            parameters={parameters}
            selectedAlgorithm={selectedAlgorithm}
            polygonToTransform={transformedPolygon}
            activeMenu={activeSidebarMenu} 
            clipWindow={clipWindow}
          />
        </div>
      </div>
    </div>
  );
}

export default App;