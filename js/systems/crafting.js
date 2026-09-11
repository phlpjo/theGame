import { state, canAfford, spendResources, addItem, unlockBuilding, addLog } from "../state/state.js";
import { ITEMS } from "../data/items.js";

export function isRecipeAvailable(recipe) {
  if (!state.buildings[recipe.requiredBuilding]) return false;
  if (recipe.once && recipe.result.type === "building" && state.buildings[recipe.result.id]) {
    return false; // schon gebaut
  }
  return true;
}

export function canCraft(recipe) {
  return isRecipeAvailable(recipe) && canAfford(recipe.cost);
}

export function craftRecipe(recipe) {
  if (!isRecipeAvailable(recipe)) {
    return { success: false, reason: "Nicht verfügbar." };
  }
  if (!spendResources(recipe.cost)) {
    return { success: false, reason: "Nicht genug Rohstoffe." };
  }

  if (recipe.result.type === "building") {
    unlockBuilding(recipe.result.id);
    addLog(`${recipe.name} fertiggestellt!`, "info");
  } else if (recipe.result.type === "item") {
    addItem(recipe.result.id, recipe.result.qty ?? 1);
    const item = ITEMS[recipe.result.id];
    addLog(`${item.name} hergestellt`, "good");
  }

  return { success: true };
}
