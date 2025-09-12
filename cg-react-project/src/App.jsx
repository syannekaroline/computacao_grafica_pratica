import React, { useState, useEffect, useRef, useCallback } from 'react';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';
import TopMenu from './components/TopMenu/TopMenu';
import { translate, rotate, scale } from './algorithms/transformations';
import { cohenSutherlandClip } from './algorithms/cohenSutherland';
import { sutherlandHodgmanClip } from './algorithms/sutherlandHodgman';
import { calculateBresenhamLine } from './algorithms/bresenham';
import { projectVertices } from './algorithms/projections';
import './App.css';


// Vértices de um cubo como estado inicial
const CUBE_VERTICES = [
  { x: 10, y: 10, z: 10 }, { x: 30, y: 10, z: 10 },
  { x: 30, y: 30, z: 10 }, { x: 10, y: 30, z: 10 },
  { x: 10, y: 10, z: 30 }, { x: 30, y: 10, z: 30 },
  { x: 30, y: 30, z: 30 }, { x: 10, y: 30, z: 30 },
];

// Arestas que conectam os vértices do cubo (usando os índices do array acima)
const CUBE_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0], // Face frontal
  [4, 5], [5, 6], [6, 7], [7, 4], // Face traseira
  [0, 4], [1, 5], [2, 6], [3, 7]  // Arestas de conexão
];

function App() {
  const [vertices3D, setVertices3D] = useState(CUBE_VERTICES);
  const [edges3D, setEdges3D] = useState(CUBE_EDGES); // Por enquanto, fixo para um cubo
  const [projectionType, setProjectionType] = useState('cavalier');
  const [projectionParams, setProjectionParams] = useState({ angle: 45, d: 20 });

  const [activeSidebarMenu, setActiveSidebarMenu] = useState('ALGORITHMS');
  const [currentMode, setCurrentMode] = useState('SELECT');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bresenham');

  const [sidebarWidth, setSidebarWidth] = useState(300);
  const isResizingRef = useRef(false);
  const [drawnObjects, setDrawnObjects] = useState([]);
  const [points, setPoints] = useState([]);

  const [lineClipWindow, setLineClipWindow] = useState({ xMin: 0, yMin: 0, xMax: 10, yMax: 10 });
  const [polygonClipWindow, setPolygonClipWindow] = useState({ xMin: 0, yMin: 0, xMax: 10, yMax: 10 });

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
    },
    ellipse: { center: { x: 20, y: 20 }, radiusA: 15, radiusB: 10 }
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
        newObject = { ...commonProps, type: 'polyline', params: { points: [...points] }, originalPoints: [...points], color: '#000000' };
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
      case 'ellipse':
        newObject = { ...commonProps, type: 'ellipse', params: { ...parameters.ellipse }, color: '#f39c12' };
        break;
      default:
        return;
    }
    if (newObject) {
      setDrawnObjects(prev => [...prev, newObject]);
    }
  };

  const handleApplyClip = () => {
    const { xMin, yMin, xMax, yMax } = lineClipWindow;

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
  
  const handleApplyPolygonClip = () => {
    const { xMin, yMin, xMax, yMax } = polygonClipWindow;

    if (xMin >= xMax || yMin >= yMax) {
      alert("Erro: Os valores mínimos da janela de recorte devem ser menores que os valores máximos.");
      return;
    }
    
    const lastPolylineIndex = drawnObjects.map(obj => obj.type).lastIndexOf('polyline');
    
    if (lastPolylineIndex === -1) {
      alert("Nenhum polígono (polilinha) encontrado para recortar. Por favor, desenhe um primeiro.");
      return;
    }

    const polylineToClip = drawnObjects[lastPolylineIndex];
    let clippedVertices = sutherlandHodgmanClip(polylineToClip.params.points, polygonClipWindow);

    clippedVertices = clippedVertices.map(vertex => {
        let { x, y } = vertex;
        if (x === xMax) x--;
        if (y === yMax) y--;
        return { x, y };
    });

    if (clippedVertices.length < 3) {
      setDrawnObjects(prev => prev.filter((_, index) => index !== lastPolylineIndex));
      alert("O polígono foi inteiramente recortado.");
    } else {
      setDrawnObjects(prev => prev.map((obj, index) => {
        if (index === lastPolylineIndex) {
          return { ...obj, params: { ...obj.params, points: clippedVertices } };
        }
        return obj;
      }));
    }
  };

  const findLastPolyline = () => {
    const lastPolylineIndex = drawnObjects.map(obj => obj.type).lastIndexOf('polyline');
    if (lastPolylineIndex === -1) {
      alert("Nenhum polígono (polilinha) encontrado para transformar. Por favor, desenhe um primeiro.");
      return { polyline: null, index: -1 };
    }
    return { polyline: drawnObjects[lastPolylineIndex], index: lastPolylineIndex };
  };
  
  const handleApplyTranslate = () => {
    const { polyline, index } = findLastPolyline();
    if (!polyline) return;
    
    const { tx, ty } = parameters.transformations.translate;
    const newVertices = translate(polyline.params.points, tx, ty);
    
    setDrawnObjects(prev => prev.map((obj, i) => 
      i === index ? { ...obj, params: { ...obj.params, points: newVertices } } : obj
    ));
  };
  
  const handleApplyScale = () => {
    const { polyline, index } = findLastPolyline();
    if (!polyline) return;

    const { sx, sy, fixedX, fixedY } = parameters.transformations.scale;
    const fixedPoint = { x: fixedX, y: fixedY };

    // Adiciona a validação para garantir que o ponto fixo é um dos vértices atuais
    const isVertex = polyline.params.points.some(
      vertex => vertex.x === fixedPoint.x && vertex.y === fixedPoint.y
    );

    if (!isVertex) {
      alert('O ponto fixo deve ser um dos vértices do polígono atual.');
      return;
    }

    const newVertices = scale(polyline.params.points, sx, sy, fixedPoint);

    setDrawnObjects(prev => prev.map((obj, i) => 
      i === index ? { ...obj, params: { ...obj.params, points: newVertices } } : obj
    ));
  };

  const handleApplyRotate = () => {
    const { polyline, index } = findLastPolyline();
    if (!polyline) return;

    const { angle, pivotX, pivotY } = parameters.transformations.rotate;
    const pivot = { x: pivotX, y: pivotY };

    // Adiciona a validação para garantir que o pivô é um dos vértices atuais
    const isVertex = polyline.params.points.some(
      vertex => vertex.x === pivot.x && vertex.y === pivot.y
    );

    if (!isVertex) {
      alert('O pivô deve ser um dos vértices do polígono atual.');
      return;
    }
    
    const newVertices = rotate(polyline.params.points, angle, pivot);
    
    setDrawnObjects(prev => prev.map((obj, i) => 
      i === index ? { ...obj, params: { ...obj.params, points: newVertices } } : obj
    ));
  };

  const handleResetPolygon = () => {
    const { polyline, index } = findLastPolyline();
    if (!polyline) return;
    
    setDrawnObjects(prev => prev.map((obj, i) => 
      i === index ? { ...obj, params: { ...obj.params, points: obj.originalPoints } } : obj
    ));
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
    const updatedPoints = points.map((point, i) => {
      if (i === index) {
        return { ...point, [axis]: parseFloat(value) || 0 };
      }
      return point;
    });
    setPoints(updatedPoints);
  };
  const handleAddPoint = () => setPoints([...points, { x: 0, y: 0 }]);
  const handleRemovePoint = (index) => setPoints(points.filter((_, i) => i !== index));

   // NOVA FUNÇÃO PARA EXECUTAR A PROJEÇÃO
  const handleProject = () => {
    // Translada o objeto para longe no eixo Z para um melhor efeito de perspectiva
    const objToProject = vertices3D.map(v => ({
      x: v.x - 20, // Centraliza em X
      y: v.y - 20, // Centraliza em Y
      z: projectionType === 'perspective' ? v.z + 50 : v.z // Empurra para longe em Z na perspectiva
    }));
    
    const projectedPoints = projectVertices(objToProject, projectionType, projectionParams);
    
    const newObject = {
      id: `projection-${Date.now()}`,
      type: 'projection',
      color: '#0e7490',
      projectedPoints: projectedPoints,
      edges: edges3D,
    };
    setDrawnObjects(prev => [...prev.filter(o => o.type !== 'projection'), newObject]);
  };

  // NOVOS HANDLERS PARA A TABELA 3D E PAINEL DE PROJEÇÃO
  const handleVertex3DChange = (index, axis, value) => {
    const updatedVertices = vertices3D.map((v, i) => 
      i === index ? { ...v, [axis]: parseFloat(value) || 0 } : v
    );
    setVertices3D(updatedVertices);
  };
  const handleAddVertex3D = () => setVertices3D([...vertices3D, { x: 0, y: 0, z: 0 }]);
  const handleRemoveVertex3D = (index) => setVertices3D(vertices3D.filter((_, i) => i !== index));
  const handleProjectionParamsChange = (param, value) => {
    setProjectionParams(prev => ({...prev, [param]: parseFloat(value)}));
  };

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
            lineClipWindow={lineClipWindow}
            setLineClipWindow={setLineClipWindow}
            onApplyClip={handleApplyClip}
            polygonClipWindow={polygonClipWindow}
            setPolygonClipWindow={setPolygonClipWindow}
            onApplyPolygonClip={handleApplyPolygonClip}
            vertices3D={vertices3D}
            onVertexChange={handleVertex3DChange}
            onAddVertex={handleAddVertex3D}
            onRemoveVertex={handleRemoveVertex3D}
            projectionType={projectionType}
            projectionParams={projectionParams}
            onProjectionTypeChange={setProjectionType}
            onProjectionParamsChange={handleProjectionParamsChange}
            onProject={handleProject}
          />
        </div>
        <div className="resizer" onMouseDown={handleMouseDown} />
        <div className="canvas-container">
          <Canvas
            drawnObjects={drawnObjects}
            points={points}
            parameters={parameters}
            selectedAlgorithm={selectedAlgorithm}
            activeMenu={activeSidebarMenu} 
            lineClipWindow={lineClipWindow}
            polygonClipWindow={polygonClipWindow}
          />
        </div>
      </div>
    </div>
  );
}

export default App;