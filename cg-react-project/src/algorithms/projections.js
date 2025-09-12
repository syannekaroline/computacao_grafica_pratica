// src/algorithms/projections.js

const toRadians = (angle) => angle * (Math.PI / 180);

/**
 * Projeta uma lista de vértices 3D para 2D usando o método selecionado.
 * @param {Array<object>} vertices - Lista de vértices 3D {x, y, z}.
 * @param {string} type - Tipo de projeção ('cavalier', 'cabinet', 'perspective').
 * @param {object} params - Parâmetros da projeção { angle, d, numVanishingPoints, dx, dy, dz }.
 * @returns {Array<object>} Lista de vértices 2D {x, y} projetados.
 */
export function projectVertices(vertices, type, params) {
  switch (type) {
    case 'cavalier': {
      const radAngle = toRadians(params.angle);
      return vertices.map(v => ({
        x: v.x + v.z * Math.cos(radAngle),
        y: v.y + v.z * Math.sin(radAngle),
      }));
    }
    case 'cabinet': {
      const radAngle = toRadians(params.angle);
      return vertices.map(v => ({
        x: v.x + 0.5 * v.z * Math.cos(radAngle),
        y: v.y + 0.5 * v.z * Math.sin(radAngle),
      }));
    }
    case 'perspective': {
      const { numVanishingPoints, dx, dy, dz } = params;
      
      // Define os fatores de perspectiva com base no número de pontos de fuga
      const p = (numVanishingPoints >= 2) ? -1 / dx : 0;
      const q = (numVanishingPoints === 3) ? -1 / dy : 0;
      const r = (numVanishingPoints >= 1) ? -1 / dz : 0;

      return vertices.map(v => {
        // A coordenada homogênea 'w' é calculada com base nos fatores de perspectiva
        // Somamos 1 para evitar divisão por zero se o ponto estiver no plano de projeção
        const w = (p * v.x) + (q * v.y) + (r * v.z) + 1;

        if (w === 0) { // Evita divisão por zero
          return { x: v.x, y: v.y };
        }

        // Realiza a divisão perspectiva
        return {
          x: v.x / w,
          y: v.y / w,
        };
      });
    }
    default:
      return vertices.map(v => ({ x: v.x, y: v.y }));
  }
}