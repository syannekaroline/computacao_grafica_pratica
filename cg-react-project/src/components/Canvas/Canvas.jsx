import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';

function Canvas({ points }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null); 

  const [zoom, setZoom] = useState(20);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Efeito para redimensionar o canvas
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

  // Efeito principal para desenhar TUDO
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
    
    // --- CÓDIGO DE DESENHO DA GRADE E EIXOS (RESTAURADO) ---
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

    // --- CÓDIGO DE DESENHO DOS NÚMEROS (RESTAURADO) ---
    context.save();
    context.scale(1, -1);
    context.font = `${14 / zoom}px Arial`;
    context.fillStyle = '#666';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    for (let x = Math.floor(view.left); x < view.right; x += gridSize) {
      if (x !== 0) context.fillText(x, x, 15 / zoom);
    }
    for (let y = Math.floor(view.bottom); y < view.top; y += gridSize) {
      if (y !== 0) context.fillText(y, -15 / zoom, -y);
    }
    context.restore();

    // --- CÓDIGO DE DESENHO DOS PONTOS ---
    context.fillStyle = '#5d1cc5ff';
    const pointSize = 8 / zoom;
    points.forEach(point => {
      context.beginPath();
      context.arc(point.x, point.y, pointSize / 2, 0, 2 * Math.PI);
      context.fill();
    });

    context.restore();
  }, [zoom, panOffset, points, canvasSize]); // canvasSize agora dispara o redesenho

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