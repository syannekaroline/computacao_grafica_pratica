// Funções auxiliares para operações com matrizes

/**
 * Multiplica duas matrizes 3x3.
 * @param {Array<Array<number>>} m1 - Matriz A
 * @param {Array<Array<number>>} m2 - Matriz B
 * @returns {Array<Array<number>>} A matriz resultante (A * B).
 */
function multiplyMatrices(m1, m2) {
  const result = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        result[i][j] += m1[i][k] * m2[k][j];
      }
    }
  }
  return result;
}

/**
 * Multiplica uma matriz 3x3 por um vetor (ponto em coordenada homogênea).
 * @param {Array<Array<number>>} matrix - A matriz de transformação.
 * @param {Array<number>} vector - O vetor [x, y, 1].
 * @returns {Array<number>} O vetor transformado [x', y', 1].
 */
function multiplyMatrixVector(matrix, vector) {
  const result = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      result[i] += matrix[i][j] * vector[j];
    }
  }
  return result;
}


// Funções de Transformação Geométrica usando Matrizes

/**
 * Translada um conjunto de vértices usando matrizes em coordenadas homogêneas. [cite: 635, 638]
 * @param {Array<Object>} vertices - Array de vértices, ex: [{x: 10, y: 20}, ...]
 * @param {number} tx - Deslocamento no eixo X.
 * @param {number} ty - Deslocamento no eixo Y.
 * @returns {Array<Object>} Um novo array com os vértices transladados.
 */
export function translate(vertices, tx, ty) {
  // Matriz de Translação em Coordenadas Homogêneas [cite: 638]
  const translationMatrix = [
    [1, 0, tx],
    [0, 1, ty],
    [0, 0, 1],
  ];

  return vertices.map(vertex => {
    const vertexVector = [vertex.x, vertex.y, 1];
    const transformedVector = multiplyMatrixVector(translationMatrix, vertexVector);
    return { x: transformedVector[0], y: transformedVector[1] };
  });
}

/**
 * Rotaciona um conjunto de vértices em torno de um ponto pivô usando matrizes. [cite: 512, 513]
 * @param {Array<Object>} vertices - Array de vértices.
 * @param {number} angleDegrees - O ângulo de rotação em graus.
 * @param {Object} pivot - O ponto pivô, ex: {x: 50, y: 50}.
 * @returns {Array<Object>} Um novo array com os vértices rotacionados.
 */
export function rotate(vertices, angleDegrees, pivot) {
  const angleRad = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  // Passo 1: Matriz de translação para levar o pivô à origem [cite: 518]
  const toOriginMatrix = [
    [1, 0, -pivot.x],
    [0, 1, -pivot.y],
    [0, 0, 1],
  ];

  // Passo 2: Matriz de Rotação em torno da origem [cite: 639]
  const rotationMatrix = [
    [cos, -sin, 0],
    [sin,  cos, 0],
    [0,    0,   1],
  ];

  // Passo 3: Matriz de translação para levar o pivô de volta à posição original [cite: 520]
  const fromOriginMatrix = [
    [1, 0, pivot.x],
    [0, 1, pivot.y],
    [0, 0, 1],
  ];
  
  // Concatenação de matrizes: M = T(p) * R(θ) * T(-p) 
  // A ordem da multiplicação é importante: a última transformação a ser aplicada vem primeiro.
  let finalMatrix = multiplyMatrices(fromOriginMatrix, rotationMatrix);
  finalMatrix = multiplyMatrices(finalMatrix, toOriginMatrix);
  
  return vertices.map(vertex => {
    const vertexVector = [vertex.x, vertex.y, 1];
    const transformedVector = multiplyMatrixVector(finalMatrix, vertexVector);
    return { x: transformedVector[0], y: transformedVector[1] };
  });
}

/**
 * Escala um conjunto de vértices em relação a um ponto fixo usando matrizes.
 * @param {Array<Object>} vertices - Array de vértices.
 * @param {number} sx - Fator de escala no eixo X.
 * @param {number} sy - Fator de escala no eixo Y.
 * @param {Object} fixedPoint - O ponto fixo para a escala.
 * @returns {Array<Object>} Um novo array com os vértices escalados.
 */
export function scale(vertices, sx, sy, fixedPoint) {
  // Passo 1: Matriz de translação para levar o ponto fixo à origem
  const toOriginMatrix = [
    [1, 0, -fixedPoint.x],
    [0, 1, -fixedPoint.y],
    [0, 0, 1],
  ];
  
  // Passo 2: Matriz de Escala em relação à origem 
  const scaleMatrix = [
    [sx, 0,  0],
    [0,  sy, 0],
    [0,  0,  1],
  ];

  // Passo 3: Matriz de translação para levar o ponto fixo de volta
  const fromOriginMatrix = [
    [1, 0, fixedPoint.x],
    [0, 1, fixedPoint.y],
    [0, 0, 1],
  ];
  
  // Concatenação de matrizes: M = T(pf) * S(sx,sy) * T(-pf) 
  let finalMatrix = multiplyMatrices(fromOriginMatrix, scaleMatrix);
  finalMatrix = multiplyMatrices(finalMatrix, toOriginMatrix);
  
  return vertices.map(vertex => {
    const vertexVector = [vertex.x, vertex.y, 1];
    const transformedVector = multiplyMatrixVector(finalMatrix, vertexVector);
    return { x: transformedVector[0], y: transformedVector[1] };
  });
}