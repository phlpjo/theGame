import { state } from "../state/state.js";
import { HERO_CLASSES } from "../data/heroClasses.js";
import { ITEMS } from "../data/items.js";
import { availableItemsForSlot, equipItem, unequipItem } from "../systems/equip.js";
import { CAVE_DEPTHS } from "../data/caveDepths.js";
import { showModal, updateModal, hideModals } from "./modal.js";
import { showToast } from "./toast.js";
import { renderHUD } from "./hud.js";
import { openCaveRun } from "./cavePanel.js";

const SLOT_LABELS = { weapon: "Waffe", armor: "Rüstung", potion: "Trank", provision: "Proviant" };

export function openTavernPanel(world) {
  render(world);
}

export function render(world) {
  const html = `
    <button class="modal-close" id="tavern-close">✕</button>
    <h2>🏠 Handelswirtshaus</h2>
    <div class="subtitle">Bis zu 5 Helden können einkehren. Rüste sie aus und schicke sie in die Höhle.</div>
    <div class="item-list" id="hero-list">
      ${state.heroes.length === 0 ? "<div class='subtitle'>Momentan ist niemand im Wirtshaus. Warte, bis Helden eintreffen…</div>" : ""}
      ${state.heroes.map((h) => heroCardHtml(h)).join("")}
    </div>
  `;
  showModal("tavern", html);
  wire(world);
}

function heroCardHtml(hero) {
  const cls = HERO_CLASSES[hero.classId];
  const hpPct = Math.round((hero.hp / hero.maxHp) * 100);
  const busy = hero.status !== "idle";
  return `
    <div class="hero-card" data-hero="${hero.id}">
      <div class="hc-top">
        <div class="hc-name">${cls.icon} ${hero.name} — ${cls.name} (Lvl ${hero.level})</div>
        <div class="status-${hero.status}">${busy ? "In der Höhle…" : "Bereit"}</div>
      </div>
      <div class="hc-stats">
        <span>❤️ ${hero.hp}/${hero.maxHp}</span>
        <span>⚔️ ${hero.attack}</span>
        <span>🛡️ ${hero.defense}</span>
      </div>
      <div class="hc-bar-bg"><div class="hc-bar-fill" style="width:${hpPct}%"></div></div>
      <div class="subtitle">Fähigkeit: ${cls.ability.name} — ${cls.ability.desc}</div>
      <div class="hc-equip">
        ${["weapon", "armor", "potion", "provision"].map((slot) => slotHtml(hero, slot)).join("")}
      </div>
      <div class="hc-actions">
        <button data-send="${hero.id}" ${busy ? "disabled" : ""}>In Höhle schicken</button>
      </div>
    </div>
  `;
}

function slotHtml(hero, slot) {
  const equipped = hero.equipment[slot];
  const label = equipped ? `${ITEMS[equipped].icon} ${ITEMS[equipped].name}` : `${SLOT_LABELS[slot]}: leer`;
  return `<span class="hc-slot ${equipped ? "filled" : ""}" data-slot-btn="${hero.id}:${slot}">${label}</span>`;
}

function equipPickerHtml(hero, slot) {
  const options = availableItemsForSlot(slot);
  const current = hero.equipment[slot];
  return `
    <div style="margin-top:8px;">
      <select data-equip-select="${hero.id}:${slot}">
        <option value="">— ${SLOT_LABELS[slot]} wählen —</option>
        ${options.map((i) => `<option value="${i.id}">${i.icon} ${i.name}</option>`).join("")}
      </select>
      <button data-equip-confirm="${hero.id}:${slot}" class="secondary">Ausrüsten</button>
      ${current ? `<button data-unequip="${hero.id}:${slot}" class="secondary">Ablegen</button>` : ""}
    </div>
  `;
}

function wire(world) {
  document.getElementById("tavern-close").onclick = hideModals;

  document.querySelectorAll("#modal-tavern [data-slot-btn]").forEach((el) => {
    el.onclick = () => {
      const [heroId, slot] = el.dataset.slotBtn.split(":");
      el.parentElement.querySelectorAll(".slot-picker-open").forEach((d) => d.remove());
      const hero = state.heroes.find((h) => h.id === Number(heroId));
      if (hero.status !== "idle") {
        showToast("Held ist gerade unterwegs.", "bad");
        return;
      }
      const wrap = document.createElement("div");
      wrap.className = "slot-picker-open";
      wrap.innerHTML = equipPickerHtml(hero, slot);
      el.parentElement.appendChild(wrap);
      wireEquipPicker(world);
    };
  });

  document.querySelectorAll("#modal-tavern [data-send]").forEach((el) => {
    el.onclick = () => {
      const hero = state.heroes.find((h) => h.id === Number(el.dataset.send));
      openDepthPicker(hero, world);
    };
  });
}

function wireEquipPicker(world) {
  document.querySelectorAll("#modal-tavern [data-equip-confirm]").forEach((el) => {
    el.onclick = () => {
      const [heroId, slot] = el.dataset.equipConfirm.split(":");
      const select = document.querySelector(`[data-equip-select="${heroId}:${slot}"]`);
      const defId = select.value;
      if (!defId) return;
      const hero = state.heroes.find((h) => h.id === Number(heroId));
      if (equipItem(hero, slot, defId)) {
        showToast(`${ITEMS[defId].name} ausgerüstet`, "good");
        renderHUD();
        render(world);
      }
    };
  });
  document.querySelectorAll("#modal-tavern [data-unequip]").forEach((el) => {
    el.onclick = () => {
      const [heroId, slot] = el.dataset.unequip.split(":");
      const hero = state.heroes.find((h) => h.id === Number(heroId));
      if (unequipItem(hero, slot)) {
        renderHUD();
        render(world);
      }
    };
  });
}

function openDepthPicker(hero, world) {
  const html = `
    <div style="margin-top:10px;">
      <div class="subtitle">Wie tief soll ${hero.name} vordringen? Je tiefer, desto größer Risiko &amp; Beute.</div>
      <div class="item-list">
        ${CAVE_DEPTHS.map((d) => `
          <div class="cave-depth-card">
            <div class="cd-info">
              <div class="cd-name">${d.icon} ${d.name}</div>
              <div class="rc-cost">${d.rounds} Gefahren-Runden · Tribut ~${d.goldRange[0]}-${d.goldRange[1]} Gold</div>
            </div>
            <button data-depth="${d.id}">Losschicken</button>
          </div>
        `).join("")}
        <button class="secondary" id="depth-cancel">Zurück</button>
      </div>
    </div>
  `;
  updateModal("tavern", document.querySelector("#modal-tavern").innerHTML + html);
  document.getElementById("depth-cancel").onclick = () => render(world);
  document.querySelectorAll("#modal-tavern [data-depth]").forEach((el) => {
    el.onclick = () => {
      const depth = CAVE_DEPTHS.find((d) => d.id === el.dataset.depth);
      openCaveRun(hero, depth, world, () => render(world));
    };
  });
}
