// src/algorithms/cohenSutherland.js

// Constantes para representar as regiões
const INSIDE = 0; // 0000
const LEFT = 1;   // 0001
const RIGHT = 2;  // 0010
const BOTTOM = 4; // 0100
const TOP = 8;    // 1000

// Função para calcular o código da região (outcode) de um ponto
function computeOutCode(x, y, xMin, yMin, xMax, yMax) {
  let code = INSIDE;

  if (x < xMin) {
    code |= LEFT;
  } else if (x > xMax) {
    code |= RIGHT;
  }

  if (y < yMin) {
    code |= BOTTOM;
  } else if (y > yMax) {
    code |= TOP;
  }

  return code;
}

// A função principal do algoritmo de Cohen-Sutherland
export function cohenSutherlandClip(x1, y1, x2, y2, xMin, yMin, xMax, yMax) {
  let outcode1 = computeOutCode(x1, y1, xMin, yMin, xMax, yMax);
  let outcode2 = computeOutCode(x2, y2, xMin, yMin, xMax, yMax);
  let accept = false;

  while (true) {
    // Caso 1: Aceitação trivial - ambos os pontos dentro da janela
    if ((outcode1 | outcode2) === 0) {
      accept = true;
      break;
    }
    // Caso 2: Rejeição trivial - ambos os pontos fora da mesma borda
    else if ((outcode1 & outcode2) !== 0) {
      break;
    }
    // Caso 3: Recorte necessário
    else {
      let x, y;
      
      // Escolhe o ponto que está fora da janela
      const outcodeOut = outcode1 !== 0 ? outcode1 : outcode2;

      // Calcula a interseção
      if (outcodeOut & TOP) {
        x = x1 + (x2 - x1) * (yMax - y1) / (y2 - y1);
        y = yMax;
      } else if (outcodeOut & BOTTOM) {
        x = x1 + (x2 - x1) * (yMin - y1) / (y2 - y1);
        y = yMin;
      } else if (outcodeOut & RIGHT) {
        y = y1 + (y2 - y1) * (xMax - x1) / (x2 - x1);
        x = xMax;
      } else if (outcodeOut & LEFT) {
        y = y1 + (y2 - y1) * (xMin - x1) / (x2 - x1);
        x = xMin;
      }

      // Atualiza o ponto que estava fora com a nova interseção
      if (outcodeOut === outcode1) {
        x1 = x;
        y1 = y;
        outcode1 = computeOutCode(x1, y1, xMin, yMin, xMax, yMax);
      } else {
        x2 = x;
        y2 = y;
        outcode2 = computeOutCode(x2, y2, xMin, yMin, xMax, yMax);
      }
    }
  }

  if (accept) {
    return { x1: Math.round(x1), y1: Math.round(y1), x2: Math.round(x2), y2: Math.round(y2) };
  }

  return null; // Retorna nulo se a linha for completamente rejeitada
}