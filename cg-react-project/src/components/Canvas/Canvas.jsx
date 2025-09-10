import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';
import { calculateBresenhamLine } from '../../algorithms/bresenham';
import { calculateCirclePoints } from '../../algorithms/circle';
import { calculateBezierCurve } from '../../algorithms/bezier';

function Canvas({ points, parameters, selectedAlgorithm, drawnObjects }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [zoom, setZoom] = useState(20);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const [displayObjects, setDisplayObjects] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({ width, height });
        canvas.width = width;
        canvas.height = height;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (drawnObjects.length === 0) {
      setDisplayObjects([]);
      return;
    }

    const newObjects = drawnObjects.filter(
      (dObj) => !displayObjects.some((dispObj) => dispObj.id === dObj.id)
    );

    if (newObjects.length > 0) {
      newObjects.forEach((obj) => {
        let allPoints = [];
        if (obj.type === 'bresenham') {
          allPoints = calculateBresenhamLine(obj.params.p1, obj.params.p2);
        } else if (obj.type === 'circle') {
          allPoints = calculateCirclePoints(obj.params.center, obj.params.radius);
        } else if (obj.type === 'bezier') {
          const curvePoints = calculateBezierCurve(obj.params.p0, obj.params.p1, obj.params.p2, obj.params.p3);
          for (let i = 0; i < curvePoints.length - 1; i++) {
            const segment = calculateBresenhamLine(curvePoints[i], curvePoints[i + 1]);
            allPoints.push(...segment);
          }
        } else if (obj.type === 'polyline') {
            for (let i = 0; i < obj.params.points.length - 1; i++) {
                const segment = calculateBresenhamLine(obj.params.points[i], obj.params.points[i+1]);
                allPoints.push(...segment);
            }
            // Conecta o último ponto (Pn) de volta ao primeiro (P0)
            if (obj.params.points.length > 1) {
                const closingSegment = calculateBresenhamLine(obj.params.points[obj.params.points.length - 1], obj.params.points[0]);
                allPoints.push(...closingSegment);
            }
        }

        const animatedObj = { ...obj, pointsToAnimate: allPoints, points: [] }; // Renomeando para evitar conflito
        setDisplayObjects((prev) => [...prev, animatedObj]);

        let i = 0;
        const intervalId = setInterval(() => {
          if (i < allPoints.length) {
            setDisplayObjects((prev) =>
              prev.map((d) =>
                d.id === obj.id
                  ? { ...d, points: allPoints.slice(0, i + 1) }
                  : d
              )
            );
            i++;
          } else {
            clearInterval(intervalId);
          }
        }, 20);
      });
    }
  }, [drawnObjects]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas.width || !canvas.height) return;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(zoom, zoom);
    context.scale(1, -1);
    context.translate(panOffset.x, panOffset.y);

    const view = {
      left: -panOffset.x - (canvas.width / 2) / zoom,
      right: -panOffset.x + (canvas.width / 2) / zoom,
      top: -panOffset.y + (canvas.height / 2) / zoom,
      bottom: -panOffset.y - (canvas.height / 2) / zoom,
    };

    const gridSize = 1;
    context.lineWidth = 1 / zoom;
    context.strokeStyle = '#e0e0e0';

    for (let x = Math.floor(view.left); x < view.right; x += gridSize) {
      context.beginPath();
      context.moveTo(x, view.bottom);
      context.lineTo(x, view.top);
      context.stroke();
    }

    for (let y = Math.floor(view.bottom); y < view.top; y += gridSize) {
      context.beginPath();
      context.moveTo(view.left, y);
      context.lineTo(view.right, y);
      context.stroke();
    }

    context.lineWidth = 2 / zoom;
    context.strokeStyle = '#a0a0a0';

    context.beginPath();
    context.moveTo(view.left, 0);
    context.lineTo(view.right, 0);
    context.stroke();

    context.beginPath();
    context.moveTo(0, view.bottom);
    context.lineTo(0, view.top);
    context.stroke();

    context.save();
    context.scale(1, -1);
    context.font = `${14 / zoom}px Arial`;
    context.fillStyle = '#666';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    for (let x = Math.floor(view.left); x < view.right; x += gridSize) {
      if (x !== 0) context.fillText(x, x + 0.5, 15 / zoom);
    }
    for (let y = Math.floor(view.bottom); y < view.top; y += gridSize) {
      if (y !== 0) context.fillText(y, -15 / zoom, -(y + 0.5));
    }
    context.fillText('0', 0.5, 15 / zoom);
    context.restore();

    // DESENHA PONTOS DA TABELA (VÉRTICES DA POLILINHA EM TEMPO REAL)
    context.fillStyle = '#000000'; // Pontos em preto
    points.forEach(point => {
      context.fillRect(point.x, point.y, 1, 1);
    });

    if (selectedAlgorithm === 'bresenham' && parameters.bresenham) {
      const { p1, p2 } = parameters.bresenham;
      context.fillStyle = '#000000';
      context.fillRect(p1.x, p1.y, 1, 1);
      context.fillRect(p2.x, p2.y, 1, 1);
    }

    if (selectedAlgorithm === 'circle' && parameters.circle && parameters.circle.center) {
      const { center } = parameters.circle;
      context.fillStyle = '#000000';
      context.fillRect(center.x, center.y, 1, 1);
    }

    if (selectedAlgorithm === 'bezier' && parameters.bezier) {
      const { p0, p1, p2, p3 } = parameters.bezier;
      context.fillStyle = '#000000';
      context.fillRect(p0.x, p0.y, 1, 1);
      context.fillStyle = '#FF0000';
      context.fillRect(p1.x, p1.y, 1, 1);
      context.fillRect(p2.x, p2.y, 1, 1);
      context.fillStyle = '#000000';
      context.fillRect(p3.x, p3.y, 1, 1);
    }

    displayObjects.forEach(obj => {
      if (obj.points) {
        context.fillStyle = obj.color;
        obj.points.forEach(point => {
          context.fillRect(point.x, point.y, 1, 1);
        });
      }
    });

    context.restore();
  }, [zoom, panOffset, points, canvasSize, parameters, selectedAlgorithm, displayObjects]);

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setLastPanPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = (e.clientX - lastPanPosition.x) / zoom;
      const dy = (e.clientY - lastPanPosition.y) / zoom;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y - dy }));
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = (e) => {
    const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    setZoom(prev => prev * zoomFactor);
  };

  return (
    <div ref={containerRef} className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="main-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
    </div>
  );
}

export default Canvas;