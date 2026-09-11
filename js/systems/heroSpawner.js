import { state, addHero, addLog } from "../state/state.js";
import { randomHeroClass, randomHeroName } from "../data/heroClasses.js";

const MAX_HEROES = 5;

export function createRandomHero() {
  const cls = randomHeroClass();
  const level = 1 + Math.floor(Math.random() * 3); // Level 1-3
  const hp = Math.round(cls.base.hp + cls.perLevel.hp * (level - 1));
  const attack = Math.round(cls.base.attack + cls.perLevel.attack * (level - 1));
  const defense = Math.round(cls.base.defense + cls.perLevel.defense * (level - 1));

  return {
    name: randomHeroName(),
    classId: cls.id,
    level,
    hp,
    maxHp: hp,
    attack,
    defense,
    equipment: { weapon: null, armor: null, potion: null, provision: null },
    status: "idle", // idle | in_cave | dead(entfernt)
    runsCompleted: 0,
  };
}

// Wird periodisch aufgerufen (siehe main.js). Spawnt mit gewisser Wahrscheinlichkeit
// einen neuen Helden, solange das Wirtshaus steht und noch Platz ist.
export function trySpawnHero(chance = 0.35) {
  if (!state.buildings.tavern) return null;
  if (state.heroes.length >= MAX_HEROES) return null;
  if (Math.random() > chance) return null;

  const hero = addHero(createRandomHero());
  addLog(`${hero.name} (${hero.classId}) ist im Wirtshaus eingetroffen`, "info");
  return hero;
}

export { MAX_HEROES };
