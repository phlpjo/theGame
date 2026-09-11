import { state, allResourceIds } from "../state/state.js";
import { RESOURCES } from "../data/resources.js";

const resourcesEl = document.getElementById("hud-resources");
const goldEl = document.getElementById("hud-gold");
const logListEl = document.getElementById("log-list");

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

export function renderHUD() {
  resourcesEl.innerHTML = allResourceIds()
    .map((id) => {
      const res = RESOURCES[id];
      const qty = state.resources[id] ?? 0;
      if (res.tier === "rare" && qty === 0) return ""; // seltene Rohstoffe erst zeigen, wenn vorhanden
      return `<div class="res-chip ${id}"><span class="icon">${res.icon}</span><span>${qty}</span></div>`;
    })
    .join("");

  goldEl.innerHTML = `💰 ${state.gold} Gold`;

  const recent = state.log.slice(-30);
  logListEl.innerHTML = recent
    .map((l) => `<div class="${l.type}">${esc(l.text)}</div>`)
    .join("");
}
