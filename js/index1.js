/* ============================================================
   AVIS CYBORG RRU — REPO VIEWER (STRIPPED TO MATCH HTML)
   All DOM-dependent viewer logic removed because HTML does not
   contain any of the required viewer elements.
============================================================ */

// --- GET REPO NAME FROM URL ---
const params = new URLSearchParams(window.location.search);
const repo_name = params.get("index");

// --- CONFIG: point this at your repo ---
const CONFIG = {
  owner: "mercwar",
  repo: repo_name,
  branch: "main"
};



document.addEventListener("DOMContentLoaded", () => {

    let lastMenu = null;
    let lastSub = null;

    // MENU BUTTONS (STATIC)
    document.querySelectorAll(".rk-btn.dropdown-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
            if (lastMenu && lastMenu !== btn) {
                lastMenu.classList.remove("menu-active");
            }
            btn.classList.add("menu-active");
            lastMenu = btn;
        });
    });

    // SUB BUTTONS (DYNAMIC, AJAX-LOADED)
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".sub-btn");
        if (!btn) return;

        if (lastSub && lastSub !== btn) {
            lastSub.classList.remove("sub-active");
        }
        btn.classList.add("sub-active");
        lastSub = btn;
    });

});

