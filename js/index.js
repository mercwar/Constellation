/* ============================
   RK DROPDOWN TOGGLE
   ============================ */
const groups = document.querySelectorAll('.menu-group.has-dropdown');

groups.forEach(group => {
  const btn = group.querySelector('.dropdown-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isOpen = group.classList.contains('open');
    groups.forEach(g => g.classList.remove('open'));

    if (!isOpen) {
      group.classList.add('open');
    }
  });
});

/* ============================
   CONSTELLATION GITHUB LOADER
   (open in SAME WINDOW)
   ============================ */
async function loadConstellationRepos() {
  const container = document.getElementById('constellation-menu');
  if (!container) return;

  try {
    const response = await fetch(
      "https://api.github.com/users/mercwar/repos?per_page=100&sort=updated"
    );

    if (!response.ok) throw new Error("GitHub API error");

    const repos = await response.json();
    const clean = repos
      .filter(r => !r.fork)
      .sort((a, b) => a.name.localeCompare(b.name));

    container.innerHTML = "";

    clean.forEach(repo => {
      // 1. Open in new tab
      const btnNewTab = document.createElement("button");
      btnNewTab.className = "sub-btn repo-ext";
      btnNewTab.textContent = `${repo.name.toUpperCase()} (NEW TAB)`;
      btnNewTab.onclick = () => window.open(repo.html_url, "_blank");

      // 2. Open in same window
      const btnSelf = document.createElement("button");
      btnSelf.className = "sub-btn repo-self";
      btnSelf.textContent = `${repo.name.toUpperCase()} (IN PORT)`;
      btnSelf.onclick = () => window.location.href = repo.html_url;

      // 3. Open in tool window
      const btnTool = document.createElement("button");
      btnTool.className = "sub-btn repo-tool";
      btnTool.textContent = `${repo.name.toUpperCase()} (TOOL WINDOW)`;
      btnTool.onclick = () => openToolWindow(repo.html_url);

      container.appendChild(btnNewTab);
      container.appendChild(btnSelf);
      container.appendChild(btnTool);
    });

  } catch (err) {
    container.innerHTML =
      `<p style="color:red;padding:8px;">Error loading repos: ${err.message}</p>`;
  }
}



let toolWin = null;

function openToolWindow(url) {
  // Target the portal screen container
  const portalScreen = document.querySelector('.screen');
  if (!portalScreen) return;

  // ACTIVATE SIDEBAR MODE (Shifts position and removes background via CSS)
  portalScreen.classList.add('sidebar-mode');

  // LEFT SIDEBAR WIDTH (space for your hub)
  // LEFT SIDEBAR WIDTH (space for your hub)
  const sidebarWidth = 365; 

  // CALCULATE 100% OF REMAINING WIDTH
  const toolWidth = screen.availWidth - sidebarWidth;
  const toolHeight = screen.availHeight - 40; // Uses full available screen height minus top offset
  
  // OPEN TOOL WINDOW
  toolWin = window.open(
    url,
    "toolBrowser",
    `width=${toolWidth},height=${toolHeight},left=${sidebarWidth},top=40,` +
    "menubar=no,toolbar=no,location=no,status=no,resizable=yes"
  );


  // WATCH FOR WINDOW CLOSE
  const watcher = setInterval(() => {
    if (!toolWin || toolWin.closed) {
      
      // RESTORE ORIGINAL CENTER POSITION & BACKGROUND
      portalScreen.classList.remove('sidebar-mode');

      clearInterval(watcher);
      toolWin = null;
    }
  }, 1024);
}


// Initialize
loadConstellationRepos();
