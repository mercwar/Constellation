/* ============================
   RK DROPDOWN TOGGLE
   
   ============================ */ 
   
   let sidebarPinned = false;
   
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


      // 3. Repo: Open in tool window
      const btnTool = document.createElement("button");
      btnTool.className = "sub-btn repo-tool";
      btnTool.textContent = `${repoName.toUpperCase()} [com.Fire-Win]`;
      btnTool.onclick = () => launchPortal(repo.html_url);



      // 4C. GitHub Pages (TOOL WINDOW)
      const btnPagesTool = document.createElement("button");
      btnPagesTool.className = "sub-btn repo-pages-tool";
      btnPagesTool.textContent = `${repoName.toUpperCase()} [io.Fire-Win]`;
      btnPagesTool.onclick = () => launchPortal(pagesUrl);

      // Append all buttons into the wrapper

      block.appendChild(btnTool);
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
let lastToolURL = null;   // <-- Track URL safely

function openToolWindow(url) {
  const portalScreen = document.querySelector('.screen');
  if (!portalScreen) return;

  // If window exists and is open
  if (toolWin && !toolWin.closed) {

    // Compare with our stored URL (NOT toolWin.location)
    if (lastToolURL !== url && url !== 'http://www.bing.com/') {
      toolWin.location.href = url;   // safe navigation
      lastToolURL = url;
    }

    toolWin.focus();
    portalScreen.classList.add('sidebar-mode');
    return;
  }

  // Otherwise open a new window
  portalScreen.classList.add('sidebar-mode');

  const sidebarWidth = 365;
  const toolWidth = screen.availWidth - sidebarWidth;
  const toolHeight = screen.availHeight - 40;

  toolWin = window.open(
    url,
    "toolBrowser",
    `width=${toolWidth},height=${toolHeight},left=${sidebarWidth},top=40,` +
    "menubar=no,toolbar=no,location=no,status=no,resizable=yes"
  );

  // Store URL safely
  lastToolURL = url;

  const watcher = setInterval(() => {
	 
    if (!toolWin || toolWin.closed ||exitWin ) {
		 if(!sidebarPinned){
			  portalScreen.classList.remove('sidebar-mode');
			  clearInterval(watcher);
			  toolWin = null;
			  lastToolURL = null;
			  exitWin = false;
		 }
    }
  }, 2024);
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

function launchPortal(url) {
    const keepSelf = document.getElementById("keepInFrame").checked
        ? "_self"
        : "";

    if (keepSelf === "_self") {
        window.open(url, "_self");
    } else {
        openToolWindow(url);
    }
}


function enableSidebarMode() {
    const portalScreen = document.querySelector('.screen');
    if (portalScreen) {
        portalScreen.classList.add('sidebar-mode');
    }
}


function handleSidebarPinChange(isChecked) {
    if (isChecked) {
        sidebarPinned = true;
        enableSidebarMode();   // open sidebar when checked
    } else {
        
		closeSidebar();
    }
}
function closeSidebar() {
	sidebarPinned = false; // just clear flag, DO NOT close sidebar
    const portalScreen = document.querySelector('.screen');
    if (portalScreen) {
        portalScreen.classList.remove('sidebar-mode');
   
}
}

function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
document.addEventListener("DOMContentLoaded", () => {
  const uplink = document.getElementById("keepInFrame");

  // *** THIS IS THE PART YOU WANT ***
  const saved = getCookie("uplinkState");

  if (saved === "checked") {
    uplink.checked = true;   // ← CHECK THE BOX ON PAGE LOAD
  } else {
    uplink.checked = false;  // ← Leave unchecked
  }

  // Save cookie when user toggles
  uplink.addEventListener("change", () => {
    setCookie("uplinkState", uplink.checked ? "checked" : "unchecked");
  });
});

function restoreToConsole() {
  exitWin = true;

  const uplink = document.getElementById("keepInFrame");

  // If checked → uncheck and fire event
  if (uplink.checked) {
    uplink.checked = false;
    setCookie("uplinkState", "unchecked");

    // Fire the normal change event
    uplink.dispatchEvent(new Event("change"));
  } else {
    // Already unchecked → still fire event
    uplink.dispatchEvent(new Event("change"));
  }
}