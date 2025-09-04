/**
 * Implementa o algoritmo de Bresenham para desenhar uma linha entre dois pontos.
 * @param {object} p1 - Ponto inicial { x, y }
 * @param {object} p2 - Ponto final { x, y }
 * @returns {Array<object>} - Um array de pontos { x, y } que formam a linha.
 */
export function calculateBresenhamLine(p1, p2) {
  const points = [];
  let x1 = Math.round(p1.x);
  let y1 = Math.round(p1.y);
  const x2 = Math.round(p2.x);
  const y2 = Math.round(p2.y);

  const dx = Math.abs(x2 - x1);
  const dy = -Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx + dy;

  while (true) {
    points.push({ x: x1, y: y1 });
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