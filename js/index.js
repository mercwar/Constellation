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

        // Check if the user is typing in the custom username box
        const isEditingCustomUser = (
            document.activeElement && document.activeElement.id === "custom-username"
        );

        // Check if focus is inside the repo dropdown area
        const activeEl = document.activeElement;
        const isInsideRepoDrop =
            activeEl &&
            (
                activeEl.id === "github-username" ||      // select box
                activeEl.id === "load-user-repos" ||      // Load button
                activeEl.id === "import-user-repos" ||    // Import button
                activeEl.id === "export-user-repos" ||    // Export button
                activeEl.id === "clear-user-repos" ||     // Clear button
                activeEl.id === "custom-username" ||         // custom input
				activeEl.id === "link-box" ||         // custom input
				activeEl.id === "link-btn1" ||         // custom input
				activeEl.id === "link-btn2" ||         // custom input
				activeEl.id === "link-btn3"          // custom input
            );

        // Only focus if the gate is active, pinned, not navigating, and user is not editing/clicking repo drop
        if (keepGatewayActive && sidebarPinned && !isNavigating && !isEditingCustomUser && !isInsideRepoDrop) {
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



function summonToolWindow(url = "https://mercwar01.byethost3.com/AVIS-NEWS/index.php") {

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
    `width=${maxWidth - 40},
     height=${maxHeight - 40},
     left=${sidebarWidth + 20},
     top=${marginTop + 20},
     resizable=yes,
     scrollbars=yes`
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
        `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=None;Secure`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

/* ============================================================
   GITHUB REPO LOADER
============================================================ */
async function loadConstellationRepo(username = "mercwar") {
    const container = document.getElementById('constellation-menu');
    if (!container) return;

    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );
        if (!response.ok) throw new Error("GitHub API error");

        const repos = await response.json();
        const clean = repos.filter(r => !r.fork).sort((a, b) => a.name.localeCompare(b.name));

        container.innerHTML = "";
        clean.forEach(repo => {
            const repoName = repo.name;
            const pagesUrl = `https://${username}.github.io/${repoName}/index.html?index=${repoName}`;
            const GithubTra = `https://github.com/${username}/${repoName}/graphs/traffic`;

            const block = document.createElement("div");
            block.className = "repo-block";

            const btnTool = document.createElement("button");
            btnTool.className = "sub-btn repo-tool";
            btnTool.textContent = `${repoName.toUpperCase()} [com.Fire-Win]`;
            btnTool.onclick = () => launchPortal(`${repo.html_url}?index=${repoName}`);

            const btnPagesTool = document.createElement("button");
            btnPagesTool.className = "sub-btn repo-pages-tool";
            btnPagesTool.textContent = `${repoName.toUpperCase()} [io.Fire-Win]`;
            btnPagesTool.onclick = () => launchPortal(pagesUrl);

            // Traffic analytics button setup
            const btnPagesTra = document.createElement("button");
            btnPagesTra.className = "sub-btn repo-pages-tool";
            btnPagesTra.textContent = `${repoName.toUpperCase()} [github.Traffic]`;
            btnPagesTra.onclick = () => launchPortal(GithubTra);

            block.appendChild(btnTool);
            block.appendChild(btnPagesTool);
            block.appendChild(btnPagesTra);
            container.appendChild(block);
        });
    } catch (err) {
        container.innerHTML = `<p style="color:red;padding:8px;">Error loading repos: ${err.message}</p>`;
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
   DROPDOWN + COOKIE MANAGEMENT
============================================================ */
function clearBox() {
    const sel = document.getElementById("github-username");
    
    // 1. Remove all dynamic options
    if (sel) {
        Array.from(sel.options).forEach(opt => {
            if (opt.dataset.dynamic === "1") {
                opt.remove();
            }
        });
    }
    
    // 2. Clear the cookie by setting an expiration date in the past
    document.cookie = "user_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // 3. Clear the UI repo container
    const repoContainer = document.getElementById('constellation-menu');
    if (repoContainer) {
        repoContainer.innerHTML = "";
    }
}

function SaveToCookie() {
    const sel = document.getElementById("github-username");
    if (!sel) return;
    const users = [...sel.options].filter(opt => opt.dataset.dynamic === "1").map(opt => opt.value);
    setCookie("user_cookie", users.join(","), 365);
}


function ImportFromCookie(is_refresh = false) {
    const sel = document.getElementById("github-username");
    if (!sel) return;

    const csv = getCookie("user_cookie") || "";
   

    // 1. If manual (button click), show prompt
    let input = csv;
    if (!is_refresh) {
        input = prompt("Enter or edit your repo list (comma separated):", csv);
        if (!input) return; // Exit if user cancels
        setCookie("user_cookie", input, 365);
    }

    // 2. Clear existing dynamic options
    Array.from(sel.options).forEach(opt => {
        if (opt.dataset.dynamic === "1") opt.remove();
    });

    // 3. Populate dropdown only (no repo loading here)
    const users = input.split(",").map(u => u.trim()).filter(u => u.length > 0);

    users.forEach(u => {
        let opt = document.createElement("option");
        opt.value = u;
        opt.textContent = u;
        opt.dataset.dynamic = "1";
        sel.appendChild(opt);
    });
}


function ExportFromCookie() {
    const csv = getCookie("user_cookie");
    if (!csv) {
        alert("No repo CSV saved");
        return;
    }

    // Split into usernames
    const users = csv.split(",").map(u => u.trim()).filter(u => u.length > 0);

    // Copy raw CSV string to clipboard
    navigator.clipboard.writeText(csv).then(() => {
        // Show count only, not the actual CSV
        alert(users.length + " usernames copied to clipboard");
    }).catch(err => {
        alert("Clipboard copy failed: " + err);
    });
}

/* ============================================================
   FRAME DETECTION
============================================================ */
function enforceFrameRulesOnLoad() {
    const uplink = document.getElementById("keepInFrame");
    const pinBox = document.getElementById("pinSidebarChk");
    const gatewayBox = document.getElementById("keepGatewayActive");
    const inFrame = (window !== window.top);

    if (inFrame) {
        if (uplink) { uplink.checked = true; uplink.disabled = true; }
        if (pinBox) { pinBox.checked = false; pinBox.disabled = true; }
        sidebarPinned = false;
        closeSidebar();
        if (gatewayBox) { gatewayBox.checked = false; gatewayBox.disabled = true; }
        keepGatewayActive = false;
        stopGatewayWatcher();

        // 🔥 Shift the .screen object 250px left when in frame
        const screenEl = document.querySelector(".screen");
        if (screenEl) {
		
            screenEl.style.left = "calc(50% + 10px)";
            screenEl.style.top = "calc(50% + 22px)";
            // translate X is -50% (center) minus 250px
            screenEl.style.transform = "translate(calc(-50% - 70px), -50%)";
        }

    } else {
        if (uplink) uplink.disabled = false;
        if (pinBox) pinBox.disabled = false;
        if (gatewayBox) gatewayBox.disabled = false;

        // Reset .screen back to centered

    }
}



document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => enforceFrameRulesOnLoad(), 50);
    initDropdowns();

    // Restore Gateway Active state properly
    loadGatewayActiveState();

    // Restore uplink checkbox state
    waitForElement("input[type='checkbox'][id*='frame']", (uplink) => {
        const saved = getCookie("uplinkState");
        uplink.checked = (saved === "checked");
    });

    // Toggle custom input visibility
    waitForElement("#github-username", (userDropdown) => {
        const customInput = document.getElementById("custom-username");
        userDropdown.onchange = () => {
            customInput.style.display = (userDropdown.value === "custom") ? "block" : "none";
        };
    });

    // LOAD button
    waitForElement("#load-user-repos", (loadBtn) => {
        const userDropdown = document.getElementById("github-username");
        const customInput = document.getElementById("custom-username");

        loadBtn.onclick = () => {
            let username = userDropdown.value;
            if (username === "custom") {
                username = customInput.value.trim();
                if (!username) return alert("Enter a GitHub username");
                // add to cookie list
                let current = getCookie("user_cookie") || "";
                let arr = current ? current.split(",") : [];
                if (!arr.includes(username)) arr.push(username);
                setCookie("user_cookie", arr.join(","), 365);
				 ImportFromCookie(true);
            }
            loadConstellationRepo(username);
        };
    });

    // IMPORT button
    waitForElement("#import-user-repos", (importBtn) => {
        importBtn.onclick = () => {
            ImportFromCookie();
        };
    });

    // EXPORT button
    waitForElement("#export-user-repos", (exportBtn) => {
        exportBtn.onclick = () => {
            ExportFromCookie();
        };
    });

    // CLEAR button
    waitForElement("#clear-user-repos", (clearBtn) => {
        clearBtn.onclick = () => {
            clearBox();
        };
    });

    // Restore uplink checkbox state
    waitForElement("input[type='checkbox'][id*='frame']", (uplink) => {
        const saved = getCookie("uplinkState");
        uplink.checked = (saved === "checked");
    });

    loadCustomGitUser();
    loadConstellationRepo("mercwar");
});
function saveGatewayActiveState(isChecked) {
    setCookie("gatewayActiveState", isChecked ? "checked" : "unchecked", 365);
}

function loadGatewayActiveState() {
    const gatewayBox = document.getElementById("keepGatewayActive");
    if (!gatewayBox) return;

    const saved = getCookie("gatewayActiveState");

    if (saved) {
        // Use cookie value if it exists
        gatewayBox.checked = (saved === "checked");
        keepGatewayActive = gatewayBox.checked;
    } else {
        // First run: auto-fill ON by default
        gatewayBox.checked = true;
        keepGatewayActive = true;
        saveGatewayActiveState(true);
    }

    // Attach listener to persist changes
    gatewayBox.addEventListener("change", () => {
        keepGatewayActive = gatewayBox.checked;
        saveGatewayActiveState(gatewayBox.checked);
        handleGatewayActiveChange(gatewayBox.checked);
    });
}


// Sync textarea with cookie on load
document.addEventListener("DOMContentLoaded", () => {
    const saved = getCookie("linkBox");
    if (saved) document.getElementById("link-box").value = saved;
});

// Down-Link → copy textarea to clipboard + save cookie
function LinksToClip() {
    const ta = document.getElementById("link-box");
    const text = ta.value.trim();
    if (!text) return;

    setCookie("linkBox", text);

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        ta.select();
        document.execCommand("copy");
    }

    document.getElementById("button-display").textContent = "Links copied to clipboard and cookie!";
}

// Clear → wipe textarea + cookie
function LinksClear() {
    document.getElementById("link-box").value = "";
    setCookie("linkBox", "");
    document.getElementById("button-display").textContent = "Links cleared!";
}

// Up-link → read textarea, split into buttons, open with launchPortal()
function LinksFromText() {
    const text = document.getElementById("link-box").value.trim();
    if (!text) return;

    setCookie("linkBox", text,365);

    const links = text.split(",");
    const display = document.getElementById("button-display");
    display.innerHTML = "";

    links.forEach(link => {
        const btn = document.createElement("button");
        btn.className = "sub-btn";
        btn.textContent = link;
        btn.onclick = () => {
            // Use your existing uplink-aware function
            launchPortal("https://" + link);
        };
        display.appendChild(btn);
    });
}

function loadLinkBox() {
    const savedText = getCookie("linkBox");
    const linkBox = document.getElementById("link-box");

    if (savedText && savedText.trim() !== "") {
        linkBox.value = savedText;
    }
}
waitForElement("#link-box", () => {
    loadLinkBox();
});




