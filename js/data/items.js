// Ausrüstungs- und Verbrauchsgegenstände, die an Werkbank/Lagerfeuer hergestellt werden.
// slot: "weapon" | "armor" | "potion" | "provision"
// bonuses wirken in der Höhlen-Simulation (systems/caveSim.js)

export const ITEMS = {
  torch: {
    id: "torch", name: "Fackel", icon: "🔥", slot: null,
    description: "Erhellt den Weg. Wird beim Sammeln in der Nacht nicht benötigt (Deko/Basisitem).",
  },

  dagger: {
    id: "dagger", name: "Dolch", icon: "🗡️", slot: "weapon", tier: 1,
    bonuses: { attack: 3 },
    description: "Leichte Anfängerwaffe für Krieger und Schurken.",
  },
  shortbow: {
    id: "shortbow", name: "Kurzbogen", icon: "🏹", slot: "weapon", tier: 1,
    bonuses: { attack: 4 },
    description: "Einfacher Bogen für Bogenschützen.",
  },
  woodStaff: {
    id: "woodStaff", name: "Holzstab", icon: "🪄", slot: "weapon", tier: 1,
    bonuses: { attack: 3, ability: 1 },
    description: "Kanalisiert schwache Magie.",
  },
  leatherArmor: {
    id: "leatherArmor", name: "Lederrüstung", icon: "🥋", slot: "armor", tier: 1,
    bonuses: { defense: 3 },
    description: "Bietet grundlegenden Schutz.",
  },
  healingPotion: {
    id: "healingPotion", name: "Heiltrank", icon: "🧪", slot: "potion", tier: 1,
    bonuses: { healOnLowHp: 8 },
    description: "Heilt den Helden einmalig bei kritischem HP-Verlust.",
  },
  provisionsPack: {
    id: "provisionsPack", name: "Proviantpaket", icon: "🥖", slot: "provision", tier: 1,
    bonuses: { extraRoundSurvival: 1 },
    description: "Erlaubt eine zusätzliche Runde durchzuhalten, bevor Erschöpfung droht.",
  },

  ironSword: {
    id: "ironSword", name: "Eisenschwert", icon: "⚔️", slot: "weapon", tier: 2,
    bonuses: { attack: 8 },
    description: "Geschmiedet aus Erz, deutlich schärfer.",
  },
  huntersBow: {
    id: "huntersBow", name: "Jägerbogen", icon: "🏹", slot: "weapon", tier: 2,
    bonuses: { attack: 9 },
    description: "Verstärkt mit Mob-Sehnen.",
  },
  enchantedStaff: {
    id: "enchantedStaff", name: "Verzauberter Stab", icon: "🪄", slot: "weapon", tier: 2,
    bonuses: { attack: 6, ability: 3 },
    description: "Kristallverstärkter Stab für mächtigere Zauber.",
  },
  plateArmor: {
    id: "plateArmor", name: "Plattenrüstung", icon: "🛡️", slot: "armor", tier: 2,
    bonuses: { defense: 9 },
    description: "Schwere Rüstung aus Erz und Mob-Chitin.",
  },
  greaterHealingPotion: {
    id: "greaterHealingPotion", name: "Großer Heiltrank", icon: "🧪", slot: "potion", tier: 2,
    bonuses: { healOnLowHp: 18 },
    description: "Kristallinfundierter Trank mit starker Heilwirkung.",
  },
};

export function itemsBySlot(slot) {
  return Object.values(ITEMS).filter((i) => i.slot === slot);
}
