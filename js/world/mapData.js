// Statisches Layout der Oberwelt. TILE = Rastergröße in Pixel (32x32-Pixelraster).

export const TILE = 32;
export const MAP_W = 25; // Kacheln
export const MAP_H = 18;

export const CANVAS_W = MAP_W * TILE; // 800
export const CANVAS_H = MAP_H * TILE; // 576

export function tileToPx(gx, gy) {
  return { x: gx * TILE + TILE / 2, y: gy * TILE + TILE / 2 };
}

export const PLAYER_START = tileToPx(12, 8);

// Basisgebäude, vertikal angeordnet um das Lagerfeuer als Startpunkt.
export const BUILDINGS = [
  { id: "campfire", ...tileToPx(12, 9), size: 30, alwaysBuilt: true },
  { id: "workbench", ...tileToPx(12, 6), size: 30 },
  { id: "tavern", ...tileToPx(12, 12), size: 34 },
];

// Abbau-Knotenpunkte, rund um die Basis verteilt.
export const NODES = [
  { resourceId: "wood", ...tileToPx(3, 3) },
  { resourceId: "wood", ...tileToPx(21, 3) },
  { resourceId: "wood", ...tileToPx(3, 15) },
  { resourceId: "wood", ...tileToPx(21, 15) },
  { resourceId: "wood", ...tileToPx(6, 9) },
  { resourceId: "wood", ...tileToPx(18, 9) },

  { resourceId: "food", ...tileToPx(5, 6) },
  { resourceId: "food", ...tileToPx(19, 6) },
  { resourceId: "food", ...tileToPx(5, 12) },
  { resourceId: "food", ...tileToPx(19, 12) },
  { resourceId: "food", ...tileToPx(12, 3) },

  { resourceId: "animal", ...tileToPx(8, 15) },
  { resourceId: "animal", ...tileToPx(16, 15) },
  { resourceId: "animal", ...tileToPx(2, 9) },
  { resourceId: "animal", ...tileToPx(22, 9) },
];
