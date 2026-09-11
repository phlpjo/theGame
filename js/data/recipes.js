// Rezepte: was kostet was, an welcher Station, und was schaltet es frei.
// requiredBuilding: "campfire" | "workbench"
// result: { type: "building", id } | { type: "item", id }

export const RECIPES = [
  // --- Lagerfeuer: Grundlagen ---
  {
    id: "build_workbench",
    name: "Werkbank bauen",
    icon: "🔨",
    requiredBuilding: "campfire",
    cost: { wood: 15, food: 5 },
    result: { type: "building", id: "workbench" },
    once: true,
    description: "Schaltet fortgeschrittenes Crafting frei.",
  },
  {
    id: "craft_torch",
    name: "Fackel",
    icon: "🔥",
    requiredBuilding: "campfire",
    cost: { wood: 2 },
    result: { type: "item", id: "torch", qty: 1 },
    description: "Einfaches Basisitem.",
  },
  {
    id: "craft_provisions",
    name: "Proviantpaket",
    icon: "🥖",
    requiredBuilding: "campfire",
    cost: { food: 6 },
    result: { type: "item", id: "provisionsPack", qty: 1 },
    description: "Gibt Helden in der Höhle mehr Durchhaltevermögen.",
  },

  // --- Werkbank: Ausrüstung Tier 1 ---
  {
    id: "build_tavern",
    name: "Handelswirtshaus bauen",
    icon: "🏠",
    requiredBuilding: "workbench",
    cost: { wood: 30, animal: 15, food: 10 },
    result: { type: "building", id: "tavern" },
    once: true,
    description: "Helden können nun einkehren und in die Höhle geschickt werden.",
  },
  {
    id: "craft_dagger",
    name: "Dolch",
    icon: "🗡️",
    requiredBuilding: "workbench",
    cost: { wood: 5, animal: 3 },
    result: { type: "item", id: "dagger", qty: 1 },
  },
  {
    id: "craft_shortbow",
    name: "Kurzbogen",
    icon: "🏹",
    requiredBuilding: "workbench",
    cost: { wood: 6, animal: 2 },
    result: { type: "item", id: "shortbow", qty: 1 },
  },
  {
    id: "craft_woodstaff",
    name: "Holzstab",
    icon: "🪄",
    requiredBuilding: "workbench",
    cost: { wood: 8 },
    result: { type: "item", id: "woodStaff", qty: 1 },
  },
  {
    id: "craft_leather_armor",
    name: "Lederrüstung",
    icon: "🥋",
    requiredBuilding: "workbench",
    cost: { animal: 10 },
    result: { type: "item", id: "leatherArmor", qty: 1 },
  },
  {
    id: "craft_healing_potion",
    name: "Heiltrank",
    icon: "🧪",
    requiredBuilding: "workbench",
    cost: { food: 4, animal: 2 },
    result: { type: "item", id: "healingPotion", qty: 1 },
  },

  // --- Werkbank: Ausrüstung Tier 2 (seltene Rohstoffe aus der Höhle) ---
  {
    id: "craft_iron_sword",
    name: "Eisenschwert",
    icon: "⚔️",
    requiredBuilding: "workbench",
    cost: { ore: 8, wood: 4 },
    result: { type: "item", id: "ironSword", qty: 1 },
  },
  {
    id: "craft_hunters_bow",
    name: "Jägerbogen",
    icon: "🏹",
    requiredBuilding: "workbench",
    cost: { ore: 6, mobDrop: 4 },
    result: { type: "item", id: "huntersBow", qty: 1 },
  },
  {
    id: "craft_enchanted_staff",
    name: "Verzauberter Stab",
    icon: "🪄",
    requiredBuilding: "workbench",
    cost: { crystal: 6, wood: 4 },
    result: { type: "item", id: "enchantedStaff", qty: 1 },
  },
  {
    id: "craft_plate_armor",
    name: "Plattenrüstung",
    icon: "🛡️",
    requiredBuilding: "workbench",
    cost: { ore: 10, mobDrop: 5 },
    result: { type: "item", id: "plateArmor", qty: 1 },
  },
  {
    id: "craft_greater_potion",
    name: "Großer Heiltrank",
    icon: "🧪",
    requiredBuilding: "workbench",
    cost: { crystal: 3, food: 4 },
    result: { type: "item", id: "greaterHealingPotion", qty: 1 },
  },
];

export function recipesForBuilding(buildingId) {
  return RECIPES.filter((r) => r.requiredBuilding === buildingId);
}
