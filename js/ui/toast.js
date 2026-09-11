const root = document.getElementById("toast-root");

export function showToast(text, type = "info") {
  const el = document.createElement("div");
  el.className = `toast${type === "bad" ? " bad" : type === "good" ? " good" : ""}`;
  el.textContent = text;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(() => el.remove(), 300);
  }, 2600);
}
