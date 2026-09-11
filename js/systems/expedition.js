import { state, removeHero, addLog } from "../state/state.js";
import { simulateCaveRun } from "./caveSim.js";
import { distributeLoot } from "./loot.js";

// Startet eine Expedition: Held wird ausgeruht auf volle HP geschickt,
// Simulation läuft, danach werden die Konsequenzen (Loot oder permanenter Tod) angewendet.
export function sendHeroToCave(hero, depth) {
  if (hero.status !== "idle") return null;

  hero.status = "in_cave";
  hero.hp = hero.maxHp;

  const result = simulateCaveRun(hero, depth);

  // Tränke/Proviant sind Einwegverbrauch pro Fahrt, unabhängig vom Ausgang.
  hero.equipment.potion = null;
  hero.equipment.provision = null;

  if (result.success) {
    hero.status = "idle";
    hero.hp = result.hpLeft;
    hero.runsCompleted += 1;
    const loot = distributeLoot(depth);
    addLog(`${hero.name} kehrt siegreich aus "${depth.name}" zurück.`, "good");
    return { ...result, loot, dead: false };
  }

  addLog(`${hero.name} ist in "${depth.name}" gefallen. Die Ausrüstung ist verloren.`, "bad");
  removeHero(hero.id);
  return { ...result, loot: null, dead: true };
}
