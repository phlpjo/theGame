import { sendHeroToCave } from "../systems/expedition.js";
import { showModal } from "./modal.js";
import { renderHUD } from "./hud.js";
import { showToast } from "./toast.js";
import { RESOURCES } from "../data/resources.js";

const REVEAL_DELAY_MS = 550;

export function openCaveRun(hero, depth, world, onDone) {
  const html = `
    <h2>${depth.icon} ${depth.name}</h2>
    <div class="subtitle">${hero.name} bricht auf…</div>
    <div id="cave-run-log"></div>
    <div id="cave-run-actions"></div>
  `;
  showModal("cave", html);

  const result = sendHeroToCave(hero, depth);
  renderHUD();

  if (!result) {
    showToast("Held ist nicht bereit.", "bad");
    onDone();
    return;
  }

  revealLog(result.log, 0, () => showFinalResult(result, hero, depth, world, onDone));
}

function revealLog(log, i, onComplete) {
  const logEl = document.getElementById("cave-run-log");
  if (!logEl) return; // Modal wurde inzwischen geschlossen
  if (i >= log.length) {
    onComplete();
    return;
  }
  const entry = log[i];
  const div = document.createElement("div");
  div.className = entry.type;
  div.textContent = entry.text;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
  setTimeout(() => revealLog(log, i + 1, onComplete), REVEAL_DELAY_MS);
}

function showFinalResult(result, hero, depth, world, onDone) {
  const actionsEl = document.getElementById("cave-run-actions");
  if (!actionsEl) return;

  let summary;
  if (result.dead) {
    summary = `<div class="subtitle" style="color:#d9534f; font-weight:bold;">💀 ${hero.name} ist gefallen. Die gesamte Ausrüstung ist verloren.</div>`;
  } else {
    const lootParts = Object.entries(result.loot.resources).map(([id, qty]) => `${qty}× ${RESOURCES[id].name}`).join(", ");
    summary = `
      <div class="subtitle" style="color:#4ac07a; font-weight:bold;">
        ✅ ${hero.name} kehrt zurück (${result.hpLeft}/${result.maxHp} HP)!<br>
        Tribut: 💰 ${result.loot.gold} Gold ${lootParts ? "+ " + lootParts : ""}
      </div>`;
  }

  actionsEl.innerHTML = `${summary}<button id="cave-continue">Weiter</button>`;
  document.getElementById("cave-continue").onclick = () => {
    renderHUD();
    onDone();
  };
}
