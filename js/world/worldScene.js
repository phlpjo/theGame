import { TILE, MAP_W, MAP_H, CANVAS_W, CANVAS_H, PLAYER_START, BUILDINGS, NODES } from "./mapData.js";
import { RESOURCES } from "../data/resources.js";
import { state } from "../state/state.js";
import { gatherFromNode } from "../systems/gathering.js";

const PLAYER_SPEED = 160;
const INTERACT_RADIUS = 46;
const NODE_MAX_HITS = 3;
const NODE_RESPAWN_TIME = 16;

const BUILDING_VISUAL = {
  campfire: { color: [214, 122, 46], icon: "🔥", name: "Lagerfeuer" },
  workbench: { color: [156, 116, 74], icon: "🔨", name: "Werkbank" },
  tavern: { color: [178, 60, 60], icon: "🏠", name: "Handelswirtshaus" },
};

export function buildWorld(k, callbacks) {
  k.setBackground(26, 33, 24);

  // --- Boden ---
  for (let gy = 0; gy < MAP_H; gy++) {
    for (let gx = 0; gx < MAP_W; gx++) {
      const variant = (gx + gy) % 2 === 0;
      k.add([
        k.pos(gx * TILE, gy * TILE),
        k.rect(TILE, TILE),
        k.color(variant ? 38 : 34, variant ? 92 : 84, variant ? 46 : 42),
        k.z(-10),
      ]);
    }
  }

  // --- Rahmen ---
  k.add([k.pos(0, 0), k.rect(CANVAS_W, 6), k.color(15, 18, 15), k.z(5)]);
  k.add([k.pos(0, CANVAS_H - 6), k.rect(CANVAS_W, 6), k.color(15, 18, 15), k.z(5)]);
  k.add([k.pos(0, 0), k.rect(6, CANVAS_H), k.color(15, 18, 15), k.z(5)]);
  k.add([k.pos(CANVAS_W - 6, 0), k.rect(6, CANVAS_H), k.color(15, 18, 15), k.z(5)]);

  // --- Abbau-Knotenpunkte ---
  const nodeObjs = NODES.map((n) => {
    const res = RESOURCES[n.resourceId];
    const obj = k.add([
      k.pos(n.x, n.y),
      k.rect(26, 26, { radius: 4 }),
      k.color(...res.color),
      k.outline(2, k.rgb(20, 20, 20)),
      k.anchor("center"),
      k.opacity(1),
      "node",
      {
        resourceId: n.resourceId,
        hitsLeft: NODE_MAX_HITS,
        depleted: false,
      },
    ]);
    obj.add([k.text(res.icon, { size: 16 }), k.anchor("center"), k.pos(0, 0)]);
    return obj;
  });

  function setNodeDepleted(obj, depleted) {
    obj.depleted = depleted;
    obj.opacity = depleted ? 0.35 : 1;
  }

  // --- Gebäude ---
  const solids = [];
  const buildingObjs = {};

  function buildingIsBuilt(id) {
    return BUILDINGS.find((b) => b.id === id).alwaysBuilt || state.buildings[id];
  }

  BUILDINGS.forEach((b) => {
    const visual = BUILDING_VISUAL[b.id];
    const built = buildingIsBuilt(b.id);
    const obj = k.add([
      k.pos(b.x, b.y),
      k.rect(b.size, b.size, { radius: 5 }),
      k.color(built ? visual.color[0] : 60, built ? visual.color[1] : 60, built ? visual.color[2] : 60),
      k.outline(2, k.rgb(15, 15, 15)),
      k.anchor("center"),
      "building",
      { buildingId: b.id },
    ]);
    const label = obj.add([
      k.text(built ? visual.icon : "🔒", { size: 18 }),
      k.anchor("center"),
      k.pos(0, 0),
    ]);
    buildingObjs[b.id] = { obj, label, halfSize: b.size / 2 };
    solids.push({ x: b.x, y: b.y, half: b.size / 2 });
  });

  function refreshBuildings() {
    BUILDINGS.forEach((b) => {
      const built = buildingIsBuilt(b.id);
      const visual = BUILDING_VISUAL[b.id];
      const { obj, label } = buildingObjs[b.id];
      obj.color = built ? k.rgb(...visual.color) : k.rgb(60, 60, 60);
      label.text = built ? visual.icon : "🔒";
    });
  }

  // --- Spieler ---
  const player = k.add([
    k.pos(PLAYER_START.x, PLAYER_START.y),
    k.rect(24, 24, { radius: 4 }),
    k.color(226, 226, 236),
    k.outline(2, k.rgb(20, 20, 20)),
    k.anchor("center"),
    k.z(1),
    "player",
  ]);
  player.add([k.text("🧑", { size: 15 }), k.anchor("center"), k.pos(0, 0)]);

  const halfPlayer = 12;

  function collidesAny(x, y) {
    for (const s of solids) {
      if (
        x + halfPlayer > s.x - s.half &&
        x - halfPlayer < s.x + s.half &&
        y + halfPlayer > s.y - s.half &&
        y - halfPlayer < s.y + s.half
      ) {
        return true;
      }
    }
    return false;
  }

  // --- Interaktions-Hinweis ---
  const hint = k.add([
    k.text("[E]", { size: 12 }),
    k.pos(0, 0),
    k.anchor("center"),
    k.color(255, 230, 140),
    k.z(20),
    k.opacity(0),
  ]);

  function findNearestInteractable() {
    let nearest = null;
    let nearestDist = Infinity;
    for (const b of BUILDINGS) {
      const d = Math.hypot(player.pos.x - b.x, player.pos.y - b.y);
      if (d < INTERACT_RADIUS && d < nearestDist) {
        nearest = { type: "building", id: b.id, x: b.x, y: b.y, size: b.size };
        nearestDist = d;
      }
    }
    for (const obj of nodeObjs) {
      if (obj.depleted) continue;
      const d = Math.hypot(player.pos.x - obj.pos.x, player.pos.y - obj.pos.y);
      if (d < INTERACT_RADIUS && d < nearestDist) {
        nearest = { type: "node", obj, x: obj.pos.x, y: obj.pos.y, size: 26 };
        nearestDist = d;
      }
    }
    return nearest;
  }

  let currentTarget = null;

  k.onUpdate(() => {
    let dx = 0;
    let dy = 0;
    if (k.isKeyDown("left") || k.isKeyDown("a")) dx -= 1;
    if (k.isKeyDown("right") || k.isKeyDown("d")) dx += 1;
    if (k.isKeyDown("up") || k.isKeyDown("w")) dy -= 1;
    if (k.isKeyDown("down") || k.isKeyDown("s")) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
      const step = PLAYER_SPEED * k.dt();

      const nx = player.pos.x + dx * step;
      const ny = player.pos.y + dy * step;

      const clampedNx = Math.max(halfPlayer + 6, Math.min(CANVAS_W - halfPlayer - 6, nx));
      const clampedNy = Math.max(halfPlayer + 6, Math.min(CANVAS_H - halfPlayer - 6, ny));

      if (!collidesAny(clampedNx, player.pos.y)) player.pos.x = clampedNx;
      if (!collidesAny(player.pos.x, clampedNy)) player.pos.y = clampedNy;
    }

    currentTarget = findNearestInteractable();
    if (currentTarget) {
      hint.opacity = 1;
      hint.pos = k.vec2(currentTarget.x, currentTarget.y - currentTarget.size / 2 - 14);
    } else {
      hint.opacity = 0;
    }
  });

  k.onKeyPress("e", () => {
    if (!currentTarget) return;

    if (currentTarget.type === "node") {
      const obj = currentTarget.obj;
      if (obj.depleted) return;
      gatherFromNode(obj.resourceId);
      obj.hitsLeft -= 1;
      callbacks.onStateChanged();
      if (obj.hitsLeft <= 0) {
        setNodeDepleted(obj, true);
        k.wait(NODE_RESPAWN_TIME, () => {
          obj.hitsLeft = NODE_MAX_HITS;
          setNodeDepleted(obj, false);
        });
      }
    } else if (currentTarget.type === "building") {
      callbacks.onInteractBuilding(currentTarget.id, buildingIsBuilt(currentTarget.id));
    }
  });

  return { refreshBuildings };
}
