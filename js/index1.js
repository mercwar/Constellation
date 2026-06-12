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

// NOTHING ELSE.
// All viewer DOM elements removed because they do not exist.
// All tree rendering removed.
// All file loading removed.
// All search removed.
// All status bar removed.
// All GitHub buttons removed.
// All event listeners removed.
// All functions removed.
// All logic removed.

// This JS file is intentionally empty because your HTML
// does NOT contain the repo viewer UI.
