import { recipesForBuilding } from "../data/recipes.js";
import { RESOURCES } from "../data/resources.js";
import { state } from "../state/state.js";
import { canCraft, craftRecipe } from "../systems/crafting.js";
import { showModal, updateModal, hideModals } from "./modal.js";
import { showToast } from "./toast.js";
import { renderHUD } from "./hud.js";

const BUILDING_NAMES = {
  campfire: "Lagerfeuer",
  workbench: "Werkbank",
};

function costHtml(cost) {
  return Object.entries(cost)
    .map(([id, qty]) => {
      const res = RESOURCES[id];
      const have = state.resources[id] ?? 0;
      const short = have < qty;
      return `<span style="${short ? "color:#d9534f" : ""}">${res.icon} ${qty}</span>`;
    })
    .join("&nbsp;&nbsp;");
}

export function openCraftPanel(buildingId, world) {
  render(buildingId, world);
}

function render(buildingId, world) {
  const visibleRecipes = recipesForBuilding(buildingId); // alles anzeigen, Baugebäude ausblenden wenn schon gebaut
  const list = visibleRecipes
    .filter((r) => !(r.result.type === "building" && state.buildings[r.result.id]))
    .map((r) => {
      const ok = canCraft(r);
      return `
        <div class="recipe-card">
          <div class="rc-info">
            <div class="rc-name">${r.icon} ${r.name}</div>
            <div class="rc-cost">${costHtml(r.cost)}</div>
            ${r.description ? `<div class="rc-cost">${r.description}</div>` : ""}
          </div>
          <button data-recipe="${r.id}" ${ok ? "" : "disabled"}>Craften</button>
        </div>`;
    })
    .join("");

  const html = `
    <button class="modal-close" id="craft-close">✕</button>
    <h2>${BUILDING_NAMES[buildingId] ?? buildingId}</h2>
    <div class="subtitle">Wähle ein Rezept zum Herstellen.</div>
    <div class="recipe-list">${list || "<div class='subtitle'>Keine Rezepte verfügbar.</div>"}</div>
  `;

  showModal("craft", html);
  wire(buildingId, world);
}

function wire(buildingId, world) {
  document.getElementById("craft-close").onclick = hideModals;
  document.querySelectorAll("#modal-craft [data-recipe]").forEach((btn) => {
    btn.onclick = () => {
      const recipe = recipesForBuilding(buildingId).find((r) => r.id === btn.dataset.recipe);
      const result = craftRecipe(recipe);
      if (result.success) {
        showToast(`${recipe.name} hergestellt`, "good");
        renderHUD();
        world.refreshBuildings();
        render(buildingId, world);
      } else {
        showToast(result.reason, "bad");
      }
    };
  });
}
