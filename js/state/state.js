import { BASIC_RESOURCE_IDS, RARE_RESOURCE_IDS } from "../data/resources.js";

const SAVE_KEY = "wildmark_save_v1";

function freshState() {
  return {
    resources: { wood: 12, food: 10, animal: 4, ore: 0, crystal: 0, mobDrop: 0 },
    gold: 0,
    buildings: { campfire: true, workbench: false, tavern: false },
    inventory: {}, // defId -> qty (unequipped crafted items)
    heroes: [], // { id, name, class, level, hp, maxHp, atk, def, ability, equipment:{weapon,armor,potion,provision}, status, xp }
    log: [],
    nextHeroId: 1,
    nextLogId: 1,
  };
}

export const state = load() ?? freshState();

export function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    // storage unavailable (e.g. private mode) — ignore, game still works in-session
  }
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...freshState(), ...parsed };
  } catch (e) {
    return null;
  }
}

export function resetState() {
  Object.assign(state, freshState());
  save();
}

// --- Resources ---

export function addResource(id, qty) {
  if (qty <= 0) return;
  state.resources[id] = (state.resources[id] ?? 0) + qty;
}

export function canAfford(cost) {
  return Object.entries(cost).every(([id, qty]) => (state.resources[id] ?? 0) >= qty);
}

export function spendResources(cost) {
  if (!canAfford(cost)) return false;
  for (const [id, qty] of Object.entries(cost)) {
    state.resources[id] -= qty;
  }
  return true;
}

export function allResourceIds() {
  return [...BASIC_RESOURCE_IDS, ...RARE_RESOURCE_IDS];
}

// --- Gold ---

export function addGold(amount) {
  state.gold += amount;
}

// --- Inventory (unequipped items) ---

export function addItem(defId, qty = 1) {
  state.inventory[defId] = (state.inventory[defId] ?? 0) + qty;
}

export function removeItem(defId, qty = 1) {
  const have = state.inventory[defId] ?? 0;
  if (have < qty) return false;
  state.inventory[defId] = have - qty;
  if (state.inventory[defId] <= 0) delete state.inventory[defId];
  return true;
}

export function itemCount(defId) {
  return state.inventory[defId] ?? 0;
}

// --- Buildings ---

export function unlockBuilding(id) {
  state.buildings[id] = true;
}

// --- Log ---

export function addLog(text, type = "neutral") {
  state.log.push({ id: state.nextLogId++, text, type, t: Date.now() });
  if (state.log.length > 60) state.log.shift();
}

// --- Heroes ---

export function addHero(hero) {
  hero.id = state.nextHeroId++;
  state.heroes.push(hero);
  return hero;
}

export function removeHero(id) {
  const idx = state.heroes.findIndex((h) => h.id === id);
  if (idx >= 0) state.heroes.splice(idx, 1);
}

export function getHero(id) {
  return state.heroes.find((h) => h.id === id);
}
