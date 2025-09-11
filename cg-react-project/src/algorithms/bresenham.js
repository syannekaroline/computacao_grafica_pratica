/**
 * Implementa o algoritmo de Bresenham para desenhar uma linha entre dois pontos,
 * mantendo a consistência da rasterização mesmo para segmentos de uma linha maior.
 * @param {object} segmentP1 - Ponto inicial do segmento a ser desenhado.
 * @param {object} segmentP2 - Ponto final do segmento a ser desenhado.
 * @param {object} [originalP1] - Ponto inicial da linha original (opcional).
 * @param {object} [originalP2] - Ponto final da linha original (opcional).
 * @returns {Array<object>} - Um array de pontos { x, y } que formam o segmento da linha.
 */
export function calculateBresenhamLine(segmentP1, segmentP2, originalP1, originalP2) {
  // Se os pontos originais não forem fornecidos, a linha original é o próprio segmento.
  const startOriginal = originalP1 || segmentP1;
  const endOriginal = originalP2 || segmentP2;

  const points = [];
  let x1 = Math.round(startOriginal.x);
  let y1 = Math.round(startOriginal.y);
  const x2 = Math.round(endOriginal.x);
  const y2 = Math.round(endOriginal.y);

  // Define os limites do segmento que realmente queremos desenhar
  const minX = Math.round(Math.min(segmentP1.x, segmentP2.x));
  const maxX = Math.round(Math.max(segmentP1.x, segmentP2.x));
  const minY = Math.round(Math.min(segmentP1.y, segmentP2.y));
  const maxY = Math.round(Math.max(segmentP1.y, segmentP2.y));

  const dx = Math.abs(x2 - x1);
  const dy = -Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx + dy;

  // O loop percorre a LINHA ORIGINAL COMPLETA
  while (true) {
    // Mas SÓ ADICIONA o ponto se ele estiver DENTRO DOS LIMITES DO SEGMENTO RECORTADO
    if (x1 >= minX && x1 <= maxX && y1 >= minY && y1 <= maxY) {
      points.push({ x: x1, y: y1 });
    }
    
    if (x1 === x2 && y1 === y2) break;
    
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x1 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y1 += sy;
    }
  }
  return points;
}