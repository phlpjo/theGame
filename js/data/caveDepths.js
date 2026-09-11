// Risikostufen der Höhle: mehr Tiefe = mehr Runden, höhere Gefahr, aber besserer Loot.

export const CAVE_DEPTHS = [
  {
    id: "eingang", name: "Höhleneingang", icon: "🕳️", level: 1,
    rounds: 2, dangerBase: 6, dangerPerRound: 2,
    goldRange: [3, 8],
    lootTable: [
      { resource: "ore", chance: 0.6, qty: [1, 3] },
      { resource: "mobDrop", chance: 0.3, qty: [1, 2] },
    ],
  },
  {
    id: "stollen", name: "Alte Stollen", icon: "⛏️", level: 2,
    rounds: 3, dangerBase: 10, dangerPerRound: 3,
    goldRange: [8, 16],
    lootTable: [
      { resource: "ore", chance: 0.8, qty: [2, 5] },
      { resource: "mobDrop", chance: 0.5, qty: [1, 3] },
      { resource: "crystal", chance: 0.2, qty: [1, 1] },
    ],
  },
  {
    id: "schacht", name: "Tiefer Schacht", icon: "🌑", level: 3,
    rounds: 4, dangerBase: 15, dangerPerRound: 4,
    goldRange: [15, 28],
    lootTable: [
      { resource: "ore", chance: 0.9, qty: [3, 6] },
      { resource: "mobDrop", chance: 0.7, qty: [2, 4] },
      { resource: "crystal", chance: 0.45, qty: [1, 3] },
    ],
  },
  {
    id: "abgrund", name: "Der Abgrund", icon: "🔥", level: 4,
    rounds: 5, dangerBase: 22, dangerPerRound: 5,
    goldRange: [25, 45],
    lootTable: [
      { resource: "ore", chance: 1.0, qty: [4, 8] },
      { resource: "mobDrop", chance: 0.85, qty: [3, 6] },
      { resource: "crystal", chance: 0.65, qty: [2, 4] },
    ],
  },
  {
    id: "kern", name: "Der Kern", icon: "☠️", level: 5,
    rounds: 6, dangerBase: 30, dangerPerRound: 6,
    goldRange: [40, 70],
    lootTable: [
      { resource: "ore", chance: 1.0, qty: [5, 10] },
      { resource: "mobDrop", chance: 1.0, qty: [4, 8] },
      { resource: "crystal", chance: 0.85, qty: [3, 6] },
    ],
  },
];

export function caveDepthById(id) {
  return CAVE_DEPTHS.find((d) => d.id === id);
}
