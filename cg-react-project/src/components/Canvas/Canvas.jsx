import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css'; // Vamos criar este arquivo para o estilo

function Canvas(props) {
  const canvasRef = useRef(null);
  
  // Estado para controlar a visualização do nosso "mundo infinito"
  const [zoom, setZoom] = useState(20);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

  // O loop de desenho principal
useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Limpa o canvas antes de cada redesenho
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Salva o estado de transformação padrão
    context.save();

    // ========= A MÁGICA DA CÂMERA ACONTECE AQUI =========
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(zoom, zoom);
    context.scale(1, -1); // Inverte o Y para o sistema matemático
    context.translate(panOffset.x, panOffset.y);
    // =======================================================


    // --- PASSO 1: DESENHANDO A GRADE DINÂMICA ---
    const gridSize = 1; // O espaço entre as linhas da grade em "unidades do mundo"
    context.lineWidth = 1 / zoom; // Linhas finas que se ajustam ao zoom
    context.strokeStyle = '#e0e0e0'; // Cor cinza claro para a grade

    // Calcula os limites visíveis do "mundo"
    const view = {
      left: -panOffset.x - (canvas.width / 2) / zoom,
      right: -panOffset.x + (canvas.width / 2) / zoom,
      top: -panOffset.y + (canvas.height / 2) / zoom,
      bottom: -panOffset.y - (canvas.height / 2) / zoom,
    };

    // Desenha as linhas verticais
    for (let x = Math.floor(view.left / gridSize) * gridSize; x < view.right; x += gridSize) {
      context.beginPath();
      context.moveTo(x, view.bottom);
      context.lineTo(x, view.top);
      context.stroke();
    }

    // Desenha as linhas horizontais
    for (let y = Math.floor(view.bottom / gridSize) * gridSize; y < view.top; y += gridSize) {
      context.beginPath();
      context.moveTo(view.left, y);
      context.lineTo(view.right, y);
      context.stroke();
    }


    // --- PASSO 2: DESENHANDO OS EIXOS PRINCIPAIS ---
    context.lineWidth = 2 / zoom; // Eixos um pouco mais grossos
    context.strokeStyle = '#a0a0a0'; // Cor cinza escuro para os eixos

    // Eixo X
    context.beginPath();
    context.moveTo(view.left, 0);
    context.lineTo(view.right, 0);
    context.stroke();

    // Eixo Y
    context.beginPath();
    context.moveTo(0, view.bottom);
    context.lineTo(0, view.top);
    context.stroke();


    // --- PASSO 3: ADICIONANDO OS NÚMEROS NOS EIXOS ---
    context.font = `${14 / zoom}px Arial`;
    context.fillStyle = '#666';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Salva o contexto antes de inverter o texto
    context.save();
    // Desfaz a inversão do Y SÓ para o texto, para que não fique de cabeça para baixo
    context.scale(1, -1);

    // Números do Eixo X
    for (let x = Math.floor(view.left / gridSize) * gridSize; x < view.right; x += gridSize) {
        if (x !== 0) { // Não desenha o número 0
            context.fillText(x, x, 15 / zoom); // O 15/zoom é um pequeno offset para o número não ficar em cima da linha
        }
    }
    
    // Números do Eixo Y
    for (let y = Math.floor(view.bottom / gridSize) * gridSize; y < view.top; y += gridSize) {
        if (y !== 0) { // Não desenha o número 0
            context.fillText(y, -15 / zoom, -y); // O Y está negativo aqui por causa da inversão que fizemos
        }
    }

    context.restore(); // Restaura o contexto para o estado com o Y invertido normal


    // --- Futuramente, aqui chamaremos as funções de desenho dos algoritmos ---


    // Restaura o estado de transformação para o padrão (antes da câmera)
    context.restore();

  }, [zoom, panOffset]); // Fim do useEffect

  // --- Funções para controlar os eventos do mouse ---

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setLastPanPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = (e.clientX - lastPanPosition.x) / zoom;
      const dy = (e.clientY - lastPanPosition.y) / zoom;
      
      // Invertemos o dy porque viramos o eixo Y
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y - dy }));
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };
  
  const handleWheel = (e) => {
    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
      // Zoom in
      setZoom(prev => prev * zoomFactor);
    } else {
      // Zoom out
      setZoom(prev => prev / zoomFactor);
    }
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