import { HERO_CLASSES } from "../data/heroClasses.js";
import { ITEMS } from "../data/items.js";

// Reine Simulationsfunktion (keine State-Mutation): berechnet den Ausgang einer
// Höhlenexpedition anhand der Heldenwerte, Ausrüstung und Risikostufe.
export function simulateCaveRun(hero, depth) {
  const cls = HERO_CLASSES[hero.classId];
  const ability = cls.ability.id;
  const { weapon, armor, potion, provision } = hero.equipment;

  let maxHp = hero.maxHp * (ability === "wanne" ? 1.2 : 1);
  let hp = maxHp;

  let power = hero.attack + hero.defense * 0.5 + hero.level * 1.2;
  if (weapon) power += ITEMS[weapon].bonuses.attack ?? 0;
  if (weapon) power += ITEMS[weapon].bonuses.ability ?? 0;
  if (armor) power += (ITEMS[armor].bonuses.defense ?? 0) * 0.5;
  if (ability === "feuerball") power *= 1.25;

  const log = [];
  let potionUsed = false;
  let provisionUsed = false;
  let died = false;

  for (let round = 1; round <= depth.rounds; round++) {
    if (ability === "hinterhalt" && Math.random() < 0.1) {
      log.push({ type: "good", text: `Runde ${round}: ${hero.name} weicht der Gefahr im Hinterhalt komplett aus.` });
      continue;
    }

    const danger = depth.dangerBase + depth.dangerPerRound * (round - 1);
    const roll = danger * (0.75 + Math.random() * 0.5);
    let dmg = Math.max(roll - power * 0.55, danger * 0.12);
    if (ability === "adlerauge") dmg *= 0.85;
    dmg = Math.round(dmg);

    hp -= dmg;
    log.push({ type: dmg > danger * 0.5 ? "bad" : "neutral", text: `Runde ${round}: ${hero.name} erleidet ${dmg} Schaden (HP ${Math.max(0, Math.round(hp))}/${Math.round(maxHp)}).` });

    if (hp <= 0) {
      if (!potionUsed && potion) {
        const heal = ITEMS[potion].bonuses.healOnLowHp ?? 0;
        hp = Math.min(maxHp, hp + heal);
        potionUsed = true;
        log.push({ type: "good", text: `${hero.name} trinkt in letzter Sekunde einen Trank und heilt ${heal} HP.` });
      }
      if (hp <= 0 && !provisionUsed && provision) {
        hp = Math.max(1, Math.round(maxHp * 0.15));
        provisionUsed = true;
        log.push({ type: "good", text: `Das Proviantpaket gibt ${hero.name} die letzte Kraft zum Weitermachen!` });
      }
      if (hp <= 0) {
        died = true;
        log.push({ type: "bad", text: `${hero.name} bricht zusammen…` });
        break;
      }
    } else if (!potionUsed && potion && hp <= maxHp * 0.3) {
      const heal = ITEMS[potion].bonuses.healOnLowHp ?? 0;
      hp = Math.min(maxHp, hp + heal);
      potionUsed = true;
      log.push({ type: "good", text: `${hero.name} trinkt einen Trank und heilt ${heal} HP.` });
    }
  }

  return {
    success: !died,
    died,
    hpLeft: Math.max(0, Math.round(hp)),
    maxHp: Math.round(maxHp),
    log,
  };
}
