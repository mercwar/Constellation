// ---------------------------------------------------------
// VIEW IN FRAME BUTTON (universal)
// ---------------------------------------------------------
const openFrameBtn = document.getElementById("openFrameBtn");
const frameViewer = document.getElementById("frameViewer");

openFrameBtn.addEventListener("click", () => {
  if (!activePath) return;

  const rawPath = activePath.split("/").map(encodeURIComponent).join("/");
  const frameURL = `${CONFIG.raw_base}/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${rawPath}`;

  // Show iframe, hide text viewer
  frameViewer.style.display = "block";
  fileContentEl.style.display = "none";
  emptyStateEl.style.display = "none";

  // Load file into iframe
  frameViewer.src = frameURL;
});
