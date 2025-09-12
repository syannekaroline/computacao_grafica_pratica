// src/algorithms/ellipse.js

/**
 * Calcula os pontos de uma elipse usando o Midpoint Ellipse Algorithm.
 * @param {object} center - O centro da elipse { x, y }.
 * @param {number} a - O raio no eixo X (raio maior).
 * @param {number} b - O raio no eixo Y (raio menor).
 * @returns {Array<object>} Uma lista de pontos { x, y } que formam a elipse.
 */
export function calculateEllipsePoints(center, a, b) {
  const points = [];
  const { x: xc, y: yc } = center;

  let x = 0;
  let y = b;

  const a2 = a * a;
  const b2 = b * b;
  
  // Parâmetros de decisão para a Região 1
  let d1 = b2 - (a2 * b) + (0.25 * a2);
  let dx = 2 * b2 * x;
  let dy = 2 * a2 * y;

  // Região 1: onde a inclinação da tangente é < 1
  while (dx < dy) {
    plotEllipsePoints(xc, yc, x, y, points);

    if (d1 < 0) {
      x++;
      dx = dx + (2 * b2);
      d1 = d1 + dx + b2;
    } else {
      x++;
      y--;
      dx = dx + (2 * b2);
      dy = dy - (2 * a2);
      d1 = d1 + dx - dy + b2;
    }
  }

  // Parâmetros de decisão para a Região 2
  let d2 = (b2 * ((x + 0.5) * (x + 0.5))) + (a2 * ((y - 1) * (y - 1))) - (a2 * b2);

  // Região 2: onde a inclinação da tangente é >= 1
  while (y >= 0) {
    plotEllipsePoints(xc, yc, x, y, points);

    if (d2 > 0) {
      y--;
      dy = dy - (2 * a2);
      d2 = d2 + a2 - dy;
    } else {
      y--;
      x++;
      dx = dx + (2 * b2);
      dy = dy - (2 * a2);
      d2 = d2 + dx - dy + a2;
    }
  }

  return points;
}

// Função auxiliar para plotar os pontos nos 4 quadrantes simétricos
function plotEllipsePoints(xc, yc, x, y, points) {
  points.push({ x: xc + x, y: yc + y });
  points.push({ x: xc - x, y: yc + y });
  points.push({ x: xc + x, y: yc - y });
  points.push({ x: xc - x, y: yc - y });
}