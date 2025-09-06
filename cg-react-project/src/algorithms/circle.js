/**
 * Implementa o Algoritmo do Ponto Médio para desenhar um círculo.
 * @param {object} center - Ponto central { x, y }
 * @param {number} radius - O raio do círculo.
 * @returns {Array<object>} - Um array de pontos { x, y } que formam o círculo.
 */
export function calculateCirclePoints(center, radius) {
  const points = [];
  let x = 0;
  let y = Math.round(radius);
  let d = 1 - Math.round(radius);

  const addPoints = (cx, cy, x, y) => {
    points.push({ x: cx + x, y: cy + y });
    points.push({ x: cx - x, y: cy + y });
    points.push({ x: cx + x, y: cy - y });
    points.push({ x: cx - x, y: cy - y });
    points.push({ x: cx + y, y: cy + x });
    points.push({ x: cx - y, y: cy + x });
    points.push({ x: cx + y, y: cy - x });
    points.push({ x: cx - y, y: cy - x });
  };

  addPoints(center.x, center.y, x, y);

  while (x < y) {
    if (d < 0) {
      d += 2 * x + 3;
    } else {
      d += 2 * (x - y) + 5;
      y--;
    }
    x++;
    addPoints(center.x, center.y, x, y);
  }
  return points;
}