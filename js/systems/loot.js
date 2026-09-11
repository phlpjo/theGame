import { addResource, addGold, addLog } from "../state/state.js";
import { RESOURCES } from "../data/resources.js";

// Würfelt die Belohnung einer erfolgreichen Expedition aus und trägt sie ins Lager ein.
export function distributeLoot(depth) {
  const [goldMin, goldMax] = depth.goldRange;
  const gold = goldMin + Math.floor(Math.random() * (goldMax - goldMin + 1));
  addGold(gold);

  const resources = {};
  for (const drop of depth.lootTable) {
    if (Math.random() <= drop.chance) {
      const [min, max] = drop.qty;
      const qty = min + Math.floor(Math.random() * (max - min + 1));
      resources[drop.resource] = (resources[drop.resource] ?? 0) + qty;
      addResource(drop.resource, qty);
    }
  }

  const resSummary = Object.entries(resources)
    .map(([id, qty]) => `${qty} ${RESOURCES[id].name}`)
    .join(", ");
  addLog(`Tribut: ${gold} Gold${resSummary ? " + " + resSummary : ""}`, "good");

  return { gold, resources };
}
