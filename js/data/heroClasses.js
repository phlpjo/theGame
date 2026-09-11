// Heldenklassen mit Basiswerten (pro Level skaliert) und einer Fähigkeit,
// die in der Höhlen-Simulation als Bonus wirkt.

export const HERO_CLASSES = {
  krieger: {
    id: "krieger", name: "Krieger", icon: "⚔️",
    base: { hp: 26, attack: 6, defense: 5 },
    perLevel: { hp: 4, attack: 1.5, defense: 1 },
    ability: { id: "wanne", name: "Wanne", desc: "+20% effektive HP", },
    preferredWeaponSlot: "weapon",
  },
  magier: {
    id: "magier", name: "Magier", icon: "🧙",
    base: { hp: 16, attack: 8, defense: 2 },
    perLevel: { hp: 2, attack: 2.2, defense: 0.5 },
    ability: { id: "feuerball", name: "Feuerball", desc: "+25% Angriff gegen Höhlengefahr" },
    preferredWeaponSlot: "weapon",
  },
  bogenschuetze: {
    id: "bogenschuetze", name: "Bogenschütze", icon: "🏹",
    base: { hp: 19, attack: 7, defense: 3 },
    perLevel: { hp: 2.6, attack: 1.8, defense: 0.7 },
    ability: { id: "adlerauge", name: "Adlerauge", desc: "Erkennt Gefahren früh: -15% erlittener Schaden" },
    preferredWeaponSlot: "weapon",
  },
  schurke: {
    id: "schurke", name: "Schurke", icon: "🗡️",
    base: { hp: 18, attack: 7, defense: 3 },
    perLevel: { hp: 2.4, attack: 1.9, defense: 0.6 },
    ability: { id: "hinterhalt", name: "Hinterhalt", desc: "10% Chance, eine Gefahr komplett zu ignorieren" },
    preferredWeaponSlot: "weapon",
  },
};

export const HERO_FIRST_NAMES = [
  "Bram", "Elira", "Korin", "Yssa", "Tarek", "Mira", "Osric", "Lyra",
  "Dorn", "Fenna", "Halvard", "Ines", "Joran", "Kessy", "Lutz", "Nadia",
  "Perin", "Quenna", "Roswin", "Sella", "Thoren", "Ulla", "Varo", "Wenke",
];

export function randomHeroClass() {
  const keys = Object.keys(HERO_CLASSES);
  return HERO_CLASSES[keys[Math.floor(Math.random() * keys.length)]];
}

export function randomHeroName() {
  return HERO_FIRST_NAMES[Math.floor(Math.random() * HERO_FIRST_NAMES.length)];
}
