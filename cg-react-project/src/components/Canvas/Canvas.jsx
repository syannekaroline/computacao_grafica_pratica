import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';
import { calculateBresenhamLine } from '../../algorithms/bresenham';
import { calculateCirclePoints } from '../../algorithms/circle';
import { calculateBezierCurve } from '../../algorithms/bezier';
import { calculateScanlineFill } from '../../algorithms/scanlineFill';
import { calculateFloodFill } from '../../algorithms/floodFill';

const hexToRgba = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        255,
      ]
    : [0, 0, 0, 255];
};

function Canvas({
  points,
  parameters,
  selectedAlgorithm,
  drawnObjects,
  polygonToTransform,
  activeMenu,
  lineClipWindow,
  polygonClipWindow 
}) {
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
    let processedObjects = drawnObjects.map(obj => {
      if (obj.type === 'floodFill') return obj;
      if (obj.pixels && obj.type === 'bresenham') {
        return obj;
      }
      let allPoints = [];
      if (obj.type === 'bresenham') {
          allPoints = calculateBresenhamLine(obj.params.p1, obj.params.p2);
      } else if (obj.type === 'circle') {
        allPoints = calculateCirclePoints(obj.params.center, obj.params.radius);
      } else if (obj.type === 'bezier') {
        const curvePoints = calculateBezierCurve(obj.params.p0, obj.params.p1, obj.params.p2, obj.params.p3);
        for (let i = 0; i < curvePoints.length - 1; i++) {
          allPoints.push(...calculateBresenhamLine(curvePoints[i], curvePoints[i + 1]));
        }
      } else if (obj.type === 'polyline') {
          for (let i = 0; i < obj.params.points.length - 1; i++) {
              allPoints.push(...calculateBresenhamLine(obj.params.points[i], obj.params.points[i+1]));
          }
          if (obj.params.points.length > 1) {
              allPoints.push(...calculateBresenhamLine(obj.params.points[obj.params.points.length - 1], obj.params.points[0]));
          }
      } else if (obj.type === 'scanlineFill') {
          allPoints = calculateScanlineFill(obj.params.points);
      }
      return { ...obj, pixels: allPoints };
    });

    processedObjects = processedObjects.map(obj => {
      if (obj.type === 'floodFill') {
        const boundaryObjects = processedObjects.filter(d => d.id !== obj.id && d.pixels && d.pixels.length > 0);
        if (boundaryObjects.length === 0) return { ...obj, pixels: [] };

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        boundaryObjects.forEach(bObj => {
            bObj.pixels.forEach(p => {
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x);
                maxY = Math.max(maxY, p.y);
            });
        });

        minX -= 2; minY -= 2; maxX += 2; maxY += 2;
        const width = maxX - minX + 1;
        const height = maxY - minY + 1;

        if (width <= 0 || height <= 0 || !isFinite(width) || !isFinite(height)) return { ...obj, pixels: [] };

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
        
        ctx.fillStyle = '#000000';
        boundaryObjects.forEach(bObj => {
            bObj.pixels.forEach(p => {
                ctx.fillRect(p.x - minX, p.y - minY, 1, 1);
            });
        });
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const seed = obj.params.seed;
        const translatedSeed = { x: Math.round(seed.x - minX), y: Math.round(seed.y - minY) };
        const fillColorRgba = hexToRgba(obj.color);
        const boundaryColorRgba = [0, 0, 0, 255];
        const pointsToFill = calculateFloodFill(translatedSeed, imageData, fillColorRgba, boundaryColorRgba);
        const allPoints = pointsToFill.map(p => ({ x: p.x + minX, y: p.y + minY }));
        return { ...obj, pixels: allPoints };
      }
      return obj;
    });

    setDisplayObjects(processedObjects);
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

    context.fillStyle = '#000000';
    points.forEach(point => {
      context.fillRect(point.x, point.y, 1, 1);
    });

    if (activeMenu === 'ALGORITHMS') {
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
          context.fillRect(p3.x, p3.y, 1, 1);
          context.fillStyle = '#FF0000';
          context.fillRect(p1.x, p1.y, 1, 1);
          context.fillRect(p2.x, p2.y, 1, 1);
        }
    }
    
    displayObjects.forEach(obj => {
      if (obj.pixels) {
        context.fillStyle = obj.color;
        obj.pixels.forEach(point => {
          context.fillRect(point.x, point.y, 1, 1);
        });
      }
    });

    if (activeMenu === 'TRANSFORMS' && polygonToTransform) {
      const vertices = polygonToTransform;
      if (vertices.length > 1) {
        context.fillStyle = '#ff0000';
        for (let i = 0; i < vertices.length; i++) {
          const startPoint = vertices[i];
          const endPoint = vertices[(i + 1) % vertices.length];
          const edgePixels = calculateBresenhamLine(startPoint, endPoint);
          edgePixels.forEach(p => {
            context.fillRect(p.x, p.y, 1, 1);
          });
        }
      }
    }
    
    let clipWindowToDraw = null;
    if (selectedAlgorithm === 'cohenSutherland') {
      clipWindowToDraw = lineClipWindow;
    } else if (selectedAlgorithm === 'sutherlandHodgman') {
      clipWindowToDraw = polygonClipWindow;
    }

    if (clipWindowToDraw) {
        const { xMin, yMin, xMax, yMax } = clipWindowToDraw;
        context.strokeStyle = 'rgba(231, 76, 60, 0.8)';
        context.lineWidth = 1.5 / zoom;
        context.strokeRect(xMin, yMin, xMax - xMin, yMax - yMin);
    }

    context.restore();
  }, [zoom, panOffset, canvasSize, displayObjects, activeMenu, polygonToTransform, lineClipWindow, polygonClipWindow, points, selectedAlgorithm, parameters]);

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