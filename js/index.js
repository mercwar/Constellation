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
let lastToolURL = null;
let sidebarPinned = false;
function openToolWindow(url, opts = {}) {
    const portalScreen = document.querySelector('.screen');
    if (!portalScreen) return;

    const defaults = {
        sidebarWidth: 385,
        topSafe: 0,
        bottomSafe: 0,
        minWidth: 300,
        minHeight: 350,
        name: "DarmCom-Gate-Browser",
        features: {
            menubar: "no",
            toolbar: "no",
            location: "no",
            status: "yes",
            resizable: "yes",
            scrollbars: "yes"
        }
    };

    const cfg = Object.assign({}, defaults, opts);

    const availW = screen.availWidth;
    const availH = screen.availHeight;

    // Width: right side of screen
    const toolWidth  = Math.max(availW - cfg.sidebarWidth, cfg.minWidth);

    // Height: 90% of screen for compatibility
    const toolHeight = Math.max(Math.floor(availH * .92), cfg.minHeight);

    // Position
    const leftPos = cfg.sidebarWidth;
    const topPos  = cfg.topSafe;

    const featureParts = [
        `width=${toolWidth}`,
        `height=${toolHeight}`,
        `left=${leftPos}`,
        `top=${topPos}`
    ];

    for (const key in cfg.features) {
        featureParts.push(`${key}=${cfg.features[key]}`);
    }

    const featureString = featureParts.join(",");

    if (toolWin && !toolWin.closed) {
        if (lastToolURL !== url && url !== "http://www.bing.com/") {
            toolWin.location.href = url;
            lastToolURL = url;
        }
        toolWin.focus();
        portalScreen.classList.add("sidebar-mode");
        return;
    }

    portalScreen.classList.add("sidebar-mode");
    toolWin = window.open(url, cfg.name, featureString);
    lastToolURL = url;

    const watcher = setInterval(() => {
        if (!toolWin || toolWin.closed || exitWin) {
            if (!sidebarPinned) {
                portalScreen.classList.remove("sidebar-mode");
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
function saveUplinkState(isChecked) {
	
  setCookie("uplinkState", isChecked ? "checked" : "unchecked");
}

function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));

  document.cookie =
    `${name}=${value};` +
    `expires=${d.toUTCString()};` +
    `path=/;` +
    `SameSite=None;` +
    `Secure`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

document.addEventListener("DOMContentLoaded", () => {
  const uplink = document.getElementById("keepInFrame");

  const saved = getCookie("uplinkState");

  uplink.checked = (saved === "checked");
});
function saveCustomGitUser(name) {
    setCookie("customGitUser", name, 365);
}

function loadCustomGitUser() {
    const saved = getCookie("customGitUser");
    if (saved) {
        const input = document.getElementById("custom-username");
        if (input) input.value = saved;
    }
}
document.addEventListener("DOMContentLoaded", loadCustomGitUser);
