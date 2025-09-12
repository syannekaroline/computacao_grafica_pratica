// src/algorithms/sutherlandHodgman.js

const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;

// Função para calcular a interseção de uma aresta com uma borda da janela
const intersect = (p1, p2, edge, clipWindow) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    let x, y;

    if (edge === TOP) {
        x = p1.x + dx * (clipWindow.yMax - p1.y) / dy;
        y = clipWindow.yMax;
    } else if (edge === BOTTOM) {
        x = p1.x + dx * (clipWindow.yMin - p1.y) / dy;
        y = clipWindow.yMin;
    } else if (edge === RIGHT) {
        y = p1.y + dy * (clipWindow.xMax - p1.x) / dx;
        x = clipWindow.xMax;
    } else if (edge === LEFT) {
        y = p1.y + dy * (clipWindow.xMin - p1.x) / dx;
        x = clipWindow.xMin;
    }
    return { x: x, y: y };
};

// Função para verificar se um ponto está dentro de uma borda específica
const isInside = (p, edge, clipWindow) => {
    if (edge === TOP) return p.y <= clipWindow.yMax;
    if (edge === BOTTOM) return p.y >= clipWindow.yMin;
    if (edge === RIGHT) return p.x <= clipWindow.xMax;
    if (edge === LEFT) return p.x >= clipWindow.xMin;
    return false;
};

// Função que recorta uma lista de vértices contra UMA borda
const clipAgainstEdge = (polygon, edge, clipWindow) => {
    const result = [];
    if (polygon.length === 0) return [];

    let p1 = polygon[polygon.length - 1];

    for (const p2 of polygon) {
        const isP1Inside = isInside(p1, edge, clipWindow);
        const isP2Inside = isInside(p2, edge, clipWindow);

        // Caso 4: Sai de fora para dentro - adiciona interseção e ponto final
        if (!isP1Inside && isP2Inside) {
            result.push(intersect(p1, p2, edge, clipWindow));
            result.push(p2);
        } 
        // Caso 1: Ambos dentro - adiciona ponto final
        else if (isP1Inside && isP2Inside) {
            result.push(p2);
        } 
        // Caso 2: Sai de dentro para fora - adiciona apenas interseção
        else if (isP1Inside && !isP2Inside) {
            result.push(intersect(p1, p2, edge, clipWindow));
        }
        // Caso 3 (ambos fora) não faz nada

        p1 = p2;
    }

    return result;
};


// Função principal exportada
export const sutherlandHodgmanClip = (subjectPolygon, clipWindow) => {
    // Recorta o polígono contra cada uma das 4 bordas em sequência
    let clippedPolygon = clipAgainstEdge(subjectPolygon, LEFT, clipWindow);
    clippedPolygon = clipAgainstEdge(clippedPolygon, RIGHT, clipWindow);
    clippedPolygon = clipAgainstEdge(clippedPolygon, BOTTOM, clipWindow);
    clippedPolygon = clipAgainstEdge(clippedPolygon, TOP, clipWindow);

    return clippedPolygon;
};