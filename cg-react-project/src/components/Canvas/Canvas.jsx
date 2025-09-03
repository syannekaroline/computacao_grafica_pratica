import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';

function Canvas({ points }) { // Recebe os pontos como prop
  const canvasRef = useRef(null);

  const [zoom, setZoom] = useState(20);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

  // Função para desenhar os pontos da tabela
  const drawPoints = (context) => {
    context.fillStyle = '#FF0000'; // Cor dos pontos (vermelho)
    const pointSize = 8 / zoom; // Tamanho do ponto ajustado ao zoom

    points.forEach(point => {
      context.beginPath();
      context.arc(point.x, point.y, pointSize / 2, 0, 2 * Math.PI);
      context.fill();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(zoom, zoom);
    context.scale(1, -1);
    context.translate(panOffset.x, panOffset.y);

    const gridSize = 1;
    context.lineWidth = 1 / zoom;
    context.strokeStyle = '#e0e0e0';

    const view = {
      left: -panOffset.x - (canvas.width / 2) / zoom,
      right: -panOffset.x + (canvas.width / 2) / zoom,
      top: -panOffset.y + (canvas.height / 2) / zoom,
      bottom: -panOffset.y - (canvas.height / 2) / zoom,
    };

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
      if (x !== 0) context.fillText(x, x, 15 / zoom);
    }
    for (let y = Math.floor(view.bottom); y < view.top; y += gridSize) {
      if (y !== 0) context.fillText(y, -15 / zoom, -y);
    }
    context.restore();

    // --- DESENHA OS PONTOS DA TABELA ---
    drawPoints(context);

    context.restore();
  }, [zoom, panOffset, points]); // Adiciona 'points' ao array de dependências

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
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="main-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    />
  );
}

export default Canvas;