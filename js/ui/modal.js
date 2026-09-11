const overlay = document.getElementById("modal-overlay");
const modals = {
  craft: document.getElementById("modal-craft"),
  tavern: document.getElementById("modal-tavern"),
  cave: document.getElementById("modal-cave"),
};

export function showModal(name, html) {
  Object.values(modals).forEach((m) => m.classList.add("hidden"));
  modals[name].innerHTML = html;
  modals[name].classList.remove("hidden");
  overlay.classList.remove("hidden");
}

export function updateModal(name, html) {
  modals[name].innerHTML = html;
}

export function hideModals() {
  Object.values(modals).forEach((m) => m.classList.add("hidden"));
  overlay.classList.add("hidden");
}

export function modalRoot(name) {
  return modals[name];
}

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) hideModals();
});
