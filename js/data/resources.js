// Rohstoff-Definitionen: organische Basisrohstoffe (Oberwelt) + seltene Rohstoffe (Höhle)

export const RESOURCES = {
  wood:     { id: "wood",     name: "Holz",       icon: "🪵", tier: "basic", color: [169, 119, 58] },
  food:     { id: "food",     name: "Nahrung",    icon: "🍓", tier: "basic", color: [123, 201, 111] },
  animal:   { id: "animal",   name: "Tierisches", icon: "🦴", tier: "basic", color: [217, 138, 78] },
  ore:      { id: "ore",      name: "Erz",        icon: "⛏️", tier: "rare",  color: [154, 167, 184] },
  crystal:  { id: "crystal",  name: "Kristall",   icon: "💎", tier: "rare",  color: [127, 212, 224] },
  mobDrop:  { id: "mobDrop",  name: "Mob-Drop",   icon: "🦷", tier: "rare",  color: [181, 127, 212] },
};

export const BASIC_RESOURCE_IDS = ["wood", "food", "animal"];
export const RARE_RESOURCE_IDS = ["ore", "crystal", "mobDrop"];
