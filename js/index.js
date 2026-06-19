/* ============================================================
   AVIS CYBORG RRU — GATEWAY CORE (Optimized + Gateway Active)
   ============================================================ */

/* -------------------------------
   GLOBAL STATE
--------------------------------*/
let toolWin = null;
let lastToolURL = null;
let sidebarPinned = false;
let exitWin = false;

let keepGatewayActive = false;     // Gateway Active checkbox
let gatewayWatcher = null;         // Watcher loop
let isNavigating = false;          // Prevent focus during navigation


/* ============================================================
   DROPDOWN MENU SYSTEM
============================================================ */
function initDropdowns() {
    const groups = document.querySelectorAll('.menu-group.has-dropdown');

    groups.forEach(group => {
        const btn = group.querySelector('.dropdown-toggle');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isOpen = group.classList.contains('open');
            groups.forEach(g => g.classList.remove('open'));
            if (!isOpen) group.classList.add('open');
        });
    });
}


/* ============================================================
   GATEWAY ACTIVE WATCHER (Navigation‑Safe)
============================================================ */
function startGatewayWatcher() {
    stopGatewayWatcher(); // avoid duplicates

    gatewayWatcher = setInterval(() => {

        if (!toolWin || toolWin.closed) return;

        if (keepGatewayActive && sidebarPinned && !isNavigating) {
            toolWin.focus();
        }

    }, 900);
}

function stopGatewayWatcher() {
    if (gatewayWatcher) {
        clearInterval(gatewayWatcher);
        gatewayWatcher = null;
    }
}

function handleGatewayActiveChange(isChecked) {
    keepGatewayActive = isChecked;

    if (keepGatewayActive && sidebarPinned) {
        startGatewayWatcher();
    } else {
        stopGatewayWatcher();
    }
}



function summonToolWindow(url = "https://roborook.fanclub.rocks/AVIS-NEWS/index.php") {

    const sidebarWidth = 372;
    const marginTop    = 106;
    const marginBottom = 78;

    const maxWidth  = screen.availWidth  - sidebarWidth -8;
    const maxHeight = screen.availHeight - (marginTop + marginBottom);

    if (toolWin && !toolWin.closed) {
        isNavigating = true;
        toolWin.location.href = url;
        setTimeout(() => { isNavigating = false; }, 700);
        return;
    }

    toolWin = window.open(
        url,
        "toolBrowser",
        `width=${maxWidth},height=${maxHeight},left=${sidebarWidth},top=${marginTop},` +
        "menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes"
    );

    isNavigating = true;
    setTimeout(() => { isNavigating = false; }, 1200);
}


/* ============================================================
   PORTAL LAUNCHER (UPLINK AWARE)
============================================================ */
function launchPortal(url) {
    const uplink = document.getElementById("keepInFrame");

    if (uplink && uplink.checked) {
        window.open(url, "_self");   // UPLINK WORKS AGAIN
    } else {
        summonToolWindow(url);       // NORMAL MODE
    }
}



/* ============================================================
   SIDEBAR MODE (Gateway Active depends on this)
============================================================ */
function enableSidebarMode() {
    const portalScreen = document.querySelector('.screen');
    if (portalScreen) portalScreen.classList.add('sidebar-mode');
}

function closeSidebar() {
    sidebarPinned = false;
    const portalScreen = document.querySelector('.screen');
    if (portalScreen) portalScreen.classList.remove('sidebar-mode');
}

function handleSidebarPinChange(isChecked) {
    sidebarPinned = isChecked;

    if (isChecked) {
        enableSidebarMode();
        if (keepGatewayActive) startGatewayWatcher();
    } else {
        closeSidebar();
        stopGatewayWatcher();
    }
}


/* ============================================================
   RESTORE CONSOLE (UN-PIN)
============================================================ */
function restoreToConsole() {
    const unpin = document.querySelector("input[type='checkbox'][id*='pin']");
    if (!unpin) return console.warn("restoreToConsole: no pin checkbox found");

    if (unpin.checked) {
        unpin.click();
    }
}


/* ============================================================
   COOKIE SYSTEM
============================================================ */
function setCookie(name, value, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 86400000));
    document.cookie =
        `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=None;Secure`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}


/* ============================================================
   GITHUB REPO LOADER  (CONSTELLATION, FIXED)
============================================================ */
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

            const pagesUrl =
                `https://${username}.github.io/${repoName}/index.html?index=${repoName}`;

            const block = document.createElement("div");
            block.className = "repo-block";

            const btnTool = document.createElement("button");
            btnTool.className = "sub-btn repo-tool";
            btnTool.textContent = `${repoName.toUpperCase()} [com.Fire-Win]`;
            btnTool.onclick = () =>
                launchPortal(`${repo.html_url}?index=${repoName}`);

            const btnPagesTool = document.createElement("button");
            btnPagesTool.className = "sub-btn repo-pages-tool";
            btnPagesTool.textContent = `${repoName.toUpperCase()} [io.Fire-Win]`;
            btnPagesTool.onclick = () => launchPortal(pagesUrl);

            block.appendChild(btnTool);
            block.appendChild(btnPagesTool);
            container.appendChild(block);
        });

    } catch (err) {
        container.innerHTML =
            `<p style="color:red;padding:8px;">Error loading repos: ${err.message}</p>`;
    }
}


/* ============================================================
   CUSTOM GIT USER SAVE/LOAD
============================================================ */
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


/* ============================================================
   FRAME DETECTION + AUTO‑LOCK SYSTEM
============================================================ */
function enforceFrameRulesOnLoad() {

    const uplink = document.getElementById("keepInFrame");
    const pinBox = document.getElementById("pinSidebarChk");
    const gatewayBox = document.getElementById("keepGatewayActive");

    const inFrame = (window !== window.top);

    if (inFrame) {
        if (uplink) {
            uplink.checked = true;
            uplink.disabled = true;
        }

        if (pinBox) {
            pinBox.checked = false;
            pinBox.disabled = true;
        }
        sidebarPinned = false;
        closeSidebar();

        if (gatewayBox) {
            gatewayBox.checked = false;
            gatewayBox.disabled = true;
        }
        keepGatewayActive = false;
        stopGatewayWatcher();

    } else {
        if (uplink) uplink.disabled = false;
        if (pinBox) pinBox.disabled = false;
        if (gatewayBox) gatewayBox.disabled = false;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => enforceFrameRulesOnLoad(), 50);
    initDropdowns();

    // Wait for AJAX-loaded elements
    waitForElement("#github-username", (userDropdown) => {
        const customInput = document.getElementById("custom-username");

        userDropdown.onchange = () => {
            customInput.style.display =
                (userDropdown.value === "custom") ? "block" : "none";
        };
    });

    waitForElement("#load-user-repos", (loadBtn) => {
        const userDropdown = document.getElementById("github-username");
        const customInput = document.getElementById("custom-username");

        loadBtn.onclick = () => {
            let username = userDropdown.value;
            if (username === "custom") {
                username = customInput.value.trim();
                if (!username) return alert("Enter a GitHub username");
            }
            loadConstellationRepos(username);
        };
    });

    waitForElement("input[type='checkbox'][id*='frame']", (uplink) => {
        const saved = getCookie("uplinkState");
        uplink.checked = (saved === "checked");
    });

    loadCustomGitUser();
    loadConstellationRepos("mercwar");
});

