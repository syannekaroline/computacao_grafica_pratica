/**
 * Implementa o algoritmo de preenchimento por Varredura (Scanline).
 * Esta versão preenche estritamente o INTERIOR do polígono para preservar a cor da borda.
 * @param {Array<object>} polygonPoints - Um array de vértices do polígono [{x, y}, ...].
 * @returns {Array<object>} - Um array de pontos { x, y } que formam o preenchimento.
 */
export function calculateScanlineFill(polygonPoints) {
  const pointsToFill = [];
  if (polygonPoints.length < 3) return pointsToFill;

  let yMin = Infinity;
  let yMax = -Infinity;

  // Encontra os limites verticais do polígono (bounding box em y)
  for (const point of polygonPoints) {
    yMin = Math.min(yMin, point.y);
    yMax = Math.max(yMax, point.y);
  }

  // Itera por cada scanline, começando 1px para dentro da borda inferior
  // e parando 1px antes da borda superior para preservar as bordas horizontais.
  for (let y = Math.round(yMin) + 1; y < Math.round(yMax); y++) {
    const intersections = [];
    for (let i = 0; i < polygonPoints.length; i++) {
      const p1 = polygonPoints[i];
      const p2 = polygonPoints[(i + 1) % polygonPoints.length];

      // Lógica de interseção padrão.
      if ((p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y)) {
        // Calcula a coordenada x da interseção usando interpolação linear
        const vt = (y - p1.y) / (p2.y - p1.y);
        const x = p1.x + vt * (p2.x - p1.x);
        intersections.push(x);
      }
    }

    // Ordena as interseções da esquerda para a direita
    intersections.sort((a, b) => a - b);

    // Pinta os pixels entre pares de interseções
    for (let i = 0; i < intersections.length; i += 2) {
      if (i + 1 < intersections.length) {
        const xStart = Math.ceil(intersections[i]);
        const xEnd = Math.floor(intersections[i + 1]);

        // Preenche o interior, começando 1px para dentro da borda esquerda
        // e parando 1px antes da borda direita para preservar as bordas verticais.
        for (let x = xStart + 1; x < xEnd; x++) {
          pointsToFill.push({ x, y });
        }
      }
    }
  }

  return pointsToFill;
}