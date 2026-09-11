import { state, addItem, removeItem, itemCount } from "../state/state.js";
import { ITEMS, itemsBySlot } from "../data/items.js";

// Gibt an, welche Items aus dem Lager für einen Slot verfügbar sind.
export function availableItemsForSlot(slot) {
  return itemsBySlot(slot).filter((item) => itemCount(item.id) > 0);
}

export function equipItem(hero, slot, defId) {
  if (hero.status !== "idle") return false;
  if (!removeItem(defId, 1)) return false;

  const prev = hero.equipment[slot];
  if (prev) addItem(prev, 1); // altes Item zurück ins Lager

  hero.equipment[slot] = defId;
  return true;
}

export function unequipItem(hero, slot) {
  if (hero.status !== "idle") return false;
  const current = hero.equipment[slot];
  if (!current) return false;
  addItem(current, 1);
  hero.equipment[slot] = null;
  return true;
}
