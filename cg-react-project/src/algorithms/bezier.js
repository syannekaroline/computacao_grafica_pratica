/**
 * Calcula os pontos de uma curva de Bézier cúbica.
 * @param {object} p0 - Ponto inicial { x, y }
 * @param {object} p1 - Primeiro ponto de controle { x, y }
 * @param {object} p2 - Segundo ponto de controle { x, y }
 * @param {object} p3 - Ponto final { x, y }
 * @param {number} numSteps - O número de segmentos de linha para aproximar a curva.
 * @returns {Array<object>} - Um array de pontos { x, y } que formam a curva.
 */
export function calculateBezierCurve(p0, p1, p2, p3, numSteps = 30) {
  const points = [];
  for (let i = 0; i <= numSteps; i++) {
    const t = i / numSteps;
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    let p = { x: 0, y: 0 };
    p.x = uuu * p0.x; // (1-t)^3 * p0.x
    p.y = uuu * p0.y;

    p.x += 3 * uu * t * p1.x; // 3 * (1-t)^2 * t * p1.x
    p.y += 3 * uu * t * p1.y;

    p.x += 3 * u * tt * p2.x; // 3 * (1-t) * t^2 * p2.x
    p.y += 3 * u * tt * p2.y;

    p.x += ttt * p3.x; // t^3 * p3.x
    p.y += ttt * p3.y;

    points.push(p);
  }
  return points;
}