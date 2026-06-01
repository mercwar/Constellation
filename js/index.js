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

async function loadConstellationRepos(username = "mercwar") {
  const container = document.getElementById('constellation-menu');
  if (!container) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) throw new Error("GitHub API error");

    const repos = await response.json();
    const clean = repos
      .filter(r => !r.fork)
      .sort((a, b) => a.name.localeCompare(b.name));

    container.innerHTML = "";

    clean.forEach(repo => {
      const repoName = repo.name;
      const pagesUrl = `https://${username}.github.io/${repoName}/index.html`;

      // Create wrapper div for styling
      const block = document.createElement("div");
      block.className = "repo-block";

      // 1. Repo: Open in new tab
      const btnNewTab = document.createElement("button");
      btnNewTab.className = "sub-btn repo-ext";
      btnNewTab.textContent = `${repoName.toUpperCase()} [TAB]`;
      btnNewTab.onclick = () => window.open(repo.html_url, "_blank");

      // 2. Repo: Open in same window
      const btnSelf = document.createElement("button");
      btnSelf.className = "sub-btn repo-self";
      btnSelf.textContent = `${repoName.toUpperCase()} [PORTAL]`;
      btnSelf.onclick = () => window.location.href = repo.html_url;

      // 3. Repo: Open in tool window
      const btnTool = document.createElement("button");
      btnTool.className = "sub-btn repo-tool";
      btnTool.textContent = `${repoName.toUpperCase()} [Fire-Win]`;
      btnTool.onclick = () => openToolWindow(repo.html_url);

      // 4A. GitHub Pages (NEW TAB)
      const btnPagesNew = document.createElement("button");
      btnPagesNew.className = "sub-btn repo-pages";
      btnPagesNew.textContent = `${repoName.toUpperCase()} [TAB]`;
      btnPagesNew.onclick = () => window.open(pagesUrl, "_blank");

      // 4B. GitHub Pages (SELF)
      const btnPagesSelf = document.createElement("button");
      btnPagesSelf.className = "sub-btn repo-pages-self";
      btnPagesSelf.textContent = `${repoName.toUpperCase()} [PORTAL]`;
      btnPagesSelf.onclick = () => window.open(pagesUrl, "_self");

      // 4C. GitHub Pages (TOOL WINDOW)
      const btnPagesTool = document.createElement("button");
      btnPagesTool.className = "sub-btn repo-pages-tool";
      btnPagesTool.textContent = `${repoName.toUpperCase()} [Fire-Win]`;
      btnPagesTool.onclick = () => openToolWindow(pagesUrl);

      // Append all buttons into the wrapper
      block.appendChild(btnNewTab);
      block.appendChild(btnSelf);
      block.appendChild(btnTool);
      block.appendChild(btnPagesNew);
      block.appendChild(btnPagesSelf);
      block.appendChild(btnPagesTool);

      // Append wrapper to container
      container.appendChild(block);
    });

  } catch (err) {
    container.innerHTML =
      `<p style="color:red;padding:8px;">Error loading repos: ${err.message}</p>`;
  }
}





let exitWin = false;
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
    if (!toolWin || toolWin.closed || exitWin) {
      
      // RESTORE ORIGINAL CENTER POSITION & BACKGROUND
      portalScreen.classList.remove('sidebar-mode');
		
      clearInterval(watcher);
	  exitWin=false;
      toolWin = null;
    }
  }, 1024);
}
document.addEventListener("DOMContentLoaded", () => {

  const userDropdown = document.getElementById("github-username");
  const customInput = document.getElementById("custom-username");
  const loadBtn = document.getElementById("load-user-repos");

  // Show custom input if needed
  userDropdown.onchange = () => {
    if (userDropdown.value === "custom") {
      customInput.style.display = "block";
    } else {
      customInput.style.display = "none";
    }
  };

  // Load repos
  loadBtn.onclick = () => {
    let username = userDropdown.value;

    if (username === "custom") {
      username = customInput.value.trim();
      if (!username) return alert("Enter a GitHub username");
    }

    loadConstellationRepos(username);
  };

  // Auto-load default
  loadConstellationRepos("mercwar");
});


// Initialize
loadConstellationRepos();


function avis_load(url) {
fetch(url)
  .then(r => r.text())
  .then(html => {
    const header = document.getElementById('header-placeholder');
    return html;
  });
}