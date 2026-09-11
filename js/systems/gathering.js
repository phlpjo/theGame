import { addResource, addLog } from "../state/state.js";
import { RESOURCES } from "../data/resources.js";

// Wie viel Rohstoff pro "Schlag" auf einen Abbau-Knotenpunkt abfällt.
const YIELD_RANGE = {
  wood: [1, 3],
  food: [1, 2],
  animal: [1, 2],
};

export function gatherFromNode(resourceId) {
  const [min, max] = YIELD_RANGE[resourceId] ?? [1, 1];
  const qty = min + Math.floor(Math.random() * (max - min + 1));
  addResource(resourceId, qty);
  const res = RESOURCES[resourceId];
  addLog(`+${qty} ${res.name} gesammelt`, "good");
  return qty;
}
