/**
 * Obtém a cor de um pixel a partir dos dados da imagem do canvas.
 * @param {ImageData} imageData - O objeto ImageData do canvas.
 * @param {number} x - A coordenada X do pixel.
 * @param {number} y - A coordenada Y do pixel.
 * @returns {Array<number>} - A cor no formato [r, g, b, a].
 */
function getPixelColor(imageData, x, y) {
  if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
    return [-1, -1, -1, -1]; // Cor inválida para pixels fora da tela
  }
  const offset = (y * imageData.width + x) * 4;
  return [
    imageData.data[offset],
    imageData.data[offset + 1],
    imageData.data[offset + 2],
    imageData.data[offset + 3],
  ];
}

/**
 * Compara duas cores no formato [r, g, b, a].
 * @param {Array<number>} a - Primeira cor.
 * @param {Array<number>} b - Segunda cor.
 * @returns {boolean} - Verdadeiro se as cores forem iguais.
 */
function areColorsEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Implementa o algoritmo Boundary Fill (Preenchimento por Borda) de forma iterativa.
 * Conforme o slide "Preenchimento Recursivo" (página 47).
 * @param {object} seed - O ponto inicial { x, y } em coordenadas de tela.
 * @param {ImageData} imageData - Os dados da imagem do canvas para ler as cores dos pixels.
 * @param {Array<number>} fillColorRgba - A nova cor de preenchimento no formato [r, g, b, a].
 * @param {Array<number>} boundaryColorRgba - A cor da borda que delimita a área [r, g, b, a].
 * @returns {Array<object>} - Um array de pontos { x, y } que devem ser preenchidos.
 */
export function calculateFloodFill(seed, imageData, fillColorRgba, boundaryColorRgba) {
  const pointsToFill = [];
  const { width, height } = imageData;
  const seedX = Math.round(seed.x);
  const seedY = Math.round(seed.y);

  // Pega a cor do ponto inicial para garantir que não estamos começando em uma borda
  const startColor = getPixelColor(imageData, seedX, seedY);
  if (areColorsEqual(startColor, boundaryColorRgba) || areColorsEqual(startColor, fillColorRgba)) {
    return []; // Não faz nada se começar na borda ou numa área já preenchida
  }

  const stack = [[seedX, seedY]];
  const visited = new Set();
  visited.add(`${seedX},${seedY}`);

  while (stack.length > 0) {
    const [x, y] = stack.pop();

    const currentColor = getPixelColor(imageData, x, y);

    // A condição do slide: "se(current != edgeColor && current != color)"
    if (!areColorsEqual(currentColor, boundaryColorRgba) && !areColorsEqual(currentColor, fillColorRgba)) {
      pointsToFill.push({ x, y });

      const neighbors = [
        [x + 1, y], // Direita
        [x - 1, y], // Esquerda
        [x, y + 1], // Cima (no sistema de coordenadas do canvas)
        [x, y - 1], // Baixo (no sistema de coordenadas do canvas)
      ];

      for (const [nx, ny] of neighbors) {
        const key = `${nx},${ny}`;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited.has(key)) {
          stack.push([nx, ny]);
          visited.add(key);
        }
      }
    }
  }

  return pointsToFill;
}