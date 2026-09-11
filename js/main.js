import { CANVAS_W, CANVAS_H } from "./world/mapData.js";
import { buildWorld } from "./world/worldScene.js";
import { state, save, addLog } from "./state/state.js";
import { trySpawnHero } from "./systems/heroSpawner.js";
import { renderHUD } from "./ui/hud.js";
import { showToast } from "./ui/toast.js";
import { openCraftPanel } from "./ui/craftPanel.js";
import { openTavernPanel } from "./ui/tavernPanel.js";
import { hideModals } from "./ui/modal.js";

const k = window.kaboom({
  width: CANVAS_W,
  height: CANVAS_H,
  root: document.getElementById("game-canvas"),
  background: [26, 33, 24],
  crisp: true,
  global: false,
  debug: false,
});

let world;

function onStateChanged() {
  renderHUD();
  save();
}

function onInteractBuilding(buildingId, built) {
  if (buildingId === "campfire") {
    openCraftPanel("campfire", world);
    return;
  }
  if (buildingId === "workbench") {
    if (!built) {
      showToast("Baue zuerst am Lagerfeuer die Werkbank.", "bad");
      return;
    }
    openCraftPanel("workbench", world);
    return;
  }
  if (buildingId === "tavern") {
    if (!built) {
      showToast("Baue zuerst das Handelswirtshaus an der Werkbank.", "bad");
      return;
    }
    openTavernPanel(world);
    return;
  }
}

world = buildWorld(k, { onStateChanged, onInteractBuilding });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideModals();
});

if (state.log.length === 0) {
  addLog("Willkommen in Wildmark! Sammle Rohstoffe und baue deine Basis aus.", "info");
}
renderHUD();

// Helden treffen periodisch im Wirtshaus ein, solange Platz ist.
k.loop(8, () => {
  const hero = trySpawnHero(0.4);
  if (hero) {
    renderHUD();
    save();
  }
});

// Autosave.
k.loop(15, save);
window.addEventListener("beforeunload", save);
