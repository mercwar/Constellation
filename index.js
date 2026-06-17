// --- CONFIG: point this at your repo ---
const CONFIG = {
  owner: "mercwar",
  repo: repo_name,
  branch: "main"
};

// --- DOM refs ---
const fileTreeEl = document.getElementById("fileTree");
const currentPathEl = document.getElementById("currentPath");
const fileContentEl = document.getElementById("fileContent");
const emptyStateEl = document.getElementById("emptyState");
const fileTypeBadgeEl = document.getElementById("fileTypeBadge");
const fileMetaEl = document.getElementById("fileMeta");
const repoNameEl = document.getElementById("repoName");
const repoBranchEl = document.getElementById("repoBranch");
const repoInfoBadgeEl = document.getElementById("repoInfoBadge");
const statusDotEl = document.getElementById("statusDot");
const statusLabelEl = document.getElementById("statusLabel");
const statusTextEl = document.getElementById("statusText");
const openGithubBtn = document.getElementById("openGithubBtn");
const openRawBtn = document.getElementById("openRawBtn");
const searchInput = document.getElementById("searchInput");

let treeData = [];
let flatFiles = [];
let activePath = null;

// ---------------------------------------------------------
// STATUS BAR
// ---------------------------------------------------------
function setStatus(mode, text = "") {
  if (mode === "loading") {
    statusDotEl.classList.remove("error");
    statusLabelEl.textContent = "LOADING";
    statusTextEl.textContent = text;
  } else if (mode === "error") {
    statusDotEl.classList.add("error");
    statusLabelEl.textContent = "ERROR";
    statusTextEl.textContent = text;
  } else {
    statusDotEl.classList.remove("error");
    statusLabelEl.textContent = "READY";
    statusTextEl.textContent = text;
	
  }
}

// ---------------------------------------------------------
// TEXT FILE DETECTION (with AVIS + CBORD + fallback)
// ---------------------------------------------------------
function isTextFile(path) {
  const lower = path.toLowerCase();
  const textExts = [
    ".avis", ".cbord",   // AVIS + CBORD support

    ".js",".ts",".jsx",".tsx",".json",".md",".txt",".html",".css",".scss",".sass",".less",
    ".yml",".yaml",".xml",".c",".h",".cpp",".hpp",".cc",".hh",".py",".rb",".go",".rs",".java",
    ".cs",".php",".sh",".bat",".ps1",".toml",".ini",".cfg",".conf",".env"
  ];

  return textExts.some(ext => lower.endsWith(ext));
}

// ---------------------------------------------------------
// BUILD TREE (HARDENED)
// ---------------------------------------------------------
function buildTreeFromPaths(files) {
  const root = { name: "/", path: "", type: "dir", children: [] };

  for (const file of files) {
    if (!file || !file.path || typeof file.path !== "string") continue;

    const parts = file.path.split("/").filter(Boolean);
    if (parts.length === 0) continue;

    let node = root;
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      currentPath = currentPath ? currentPath + "/" + part : part;

      if (!node.children) node.children = [];

      if (isLast) {
        node.children.push({
          name: part,
          path: currentPath,
          type: file.type,
          size: file.size || 0,
          sha: file.sha || ""
        });
      } else {
        let childDir = node.children.find(
          c => c.type === "dir" && c.name === part
        );

        if (!childDir) {
          childDir = {
            name: part,
            path: currentPath,
            type: "dir",
            children: []
          };
          node.children.push(childDir);
        }

        node = childDir;
      }
    }
  }

  function sortNode(n) {
    if (!n.children) return;
    n.children.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "dir" ? -1 : 1;
    });
    n.children.forEach(sortNode);
  }

  sortNode(root);
  return root.children;
}

// ---------------------------------------------------------
// RENDER TREE
// ---------------------------------------------------------
function renderTree(nodes, container, filter = "") {
  container.innerHTML = "";

  function renderNode(node, parentEl) {
    const matchesFilter =
      !filter ||
      node.type === "dir" ||
      node.path.toLowerCase().includes(filter.toLowerCase());

    if (!matchesFilter) {
      if (node.type === "dir" && node.children) {
        const anyChildMatches = node.children.some(child =>
          child.path.toLowerCase().includes(filter.toLowerCase())
        );
        if (!anyChildMatches) return;
      } else {
        return;
      }
    }

    const nodeEl = document.createElement("div");
    nodeEl.className = "tree-node";
    nodeEl.dataset.path = node.path;
    nodeEl.dataset.type = node.type;

    const toggleEl = document.createElement("div");
    toggleEl.className = "tree-toggle";
    if (node.type === "dir") {
      toggleEl.textContent = "▾";
    } else {
      toggleEl.classList.add("hidden");
    }

    const iconEl = document.createElement("div");
    iconEl.className = "icon";
    iconEl.textContent = node.type === "dir" ? "📁" : "📄";

    const nameEl = document.createElement("div");
    nameEl.className = "name";
    nameEl.textContent = node.name;

    nodeEl.appendChild(toggleEl);
    nodeEl.appendChild(iconEl);
    nodeEl.appendChild(nameEl);
    parentEl.appendChild(nodeEl);

    let childrenContainer = null;
    if (node.type === "dir" && node.children && node.children.length) {
      childrenContainer = document.createElement("div");
      childrenContainer.className = "tree-children";
      parentEl.appendChild(childrenContainer);
      node.children.forEach(child => renderNode(child, childrenContainer));
    }

    nodeEl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (node.type === "dir") {
        if (childrenContainer) {
          const isHidden = childrenContainer.style.display === "none";
          childrenContainer.style.display = isHidden ? "" : "none";
          toggleEl.textContent = isHidden ? "▾" : "▸";
        }
      } else {
        selectFile(node.path);
      }
    });
  }

  nodes.forEach(node => renderNode(node, container));
}

// ---------------------------------------------------------
// FETCH REPO TREE
// ---------------------------------------------------------
async function fetchRepoTree() {
  setStatus("loading", "Fetching repo tree...");
  repoNameEl.textContent = `${CONFIG.owner}/${CONFIG.repo}`;
  repoBranchEl.textContent = CONFIG.branch;

  try {
    const refRes = await fetch(
      `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/git/refs/heads/${CONFIG.branch}`
    );
    if (!refRes.ok) throw new Error("Failed to resolve branch ref");
    const refData = await refRes.json();
    const commitSha = refData.object.sha;

    const commitRes = await fetch(
      `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/git/commits/${commitSha}`
    );
    if (!commitRes.ok) throw new Error("Failed to fetch commit");
    const commitData = await commitRes.json();
    const treeSha = commitData.tree.sha;

    const treeRes = await fetch(
      `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/git/trees/${treeSha}?recursive=1`
    );
    if (!treeRes.ok) throw new Error("Failed to fetch tree");
    const treeDataRaw = await treeRes.json();

    flatFiles = treeDataRaw.tree
      .filter(item => item.type === "blob" || item.type === "tree")
      .map(item => ({
        path: item.path,
        type: item.type === "tree" ? "dir" : "file",
        size: item.size || 0,
        sha: item.sha
      }));

    treeData = buildTreeFromPaths(flatFiles);
    renderTree(treeData, fileTreeEl);
    setStatus("ready", `Loaded ${flatFiles.length} entries`);
  } catch (err) {
    console.error(err);
    setStatus("error", err.message || "Failed to load repo");
    repoInfoBadgeEl.textContent = "GitHub API ERROR";
  }
}
function isBinaryFile(path) {
  const lower = path.toLowerCase();
  const binaryExts = [
    ".exe",".dll",".bin",".dat",".zip",".rar",".7z",".pdf",".jpg",".jpeg",".png",".gif",".bmp",".ico",
    ".mp3",".wav",".ogg",".mp4",".avi",".mov",".webm"
  ];
  return binaryExts.some(ext => lower.endsWith(ext));
}

function isImageFile(path) {
  const lower = path.toLowerCase();
  return [".png",".jpg",".jpeg",".gif",".bmp",".webp",".svg"].some(ext => lower.endsWith(ext));
}
// ---------------------------------------------------------
// SELECT FILE (RRU link + mercwar.github.io address)
// ---------------------------------------------------------
// ---------------------------------------------------------
// SELECT FILE (RRU link + mercwar.github.io address)
// ---------------------------------------------------------
async function selectFile(path) {
  activePath = path;

  // compute encoded path and Pages base
  const encodedRepo = encodeURIComponent(CONFIG.repo);
  const rawPathEncoded = path ? path.split("/").map(encodeURIComponent).join("/") : "";
  const pagesBase = `https://mercwar.github.io/${encodedRepo}`;
  // pagesURL: for files and dirs; directories can optionally have trailing slash
  const pagesURL = path ? `${pagesBase}/${rawPathEncoded}` : `${pagesBase}/`;

  // Display the path as an RRU-styled clickable link that opens in a new tab
  if (!path) {
    currentPathEl.innerHTML = `<a class="rru-link" href="${pagesURL}" target="_blank" rel="noopener noreferrer">/${CONFIG.repo}</a>`;
  } else {
    currentPathEl.innerHTML = `<a class="rru-link" href="${pagesURL}" target="_blank" rel="noopener noreferrer">/${path}</a>`;
  }

  // mark active node
  document.querySelectorAll(".tree-node").forEach(el => el.classList.remove("active"));
  const activeNode = document.querySelector(`.tree-node[data-path="${CSS.escape(path)}"]`);
  if (activeNode) activeNode.classList.add("active");

  // find file metadata
  const file = flatFiles.find(f => f.path === path && f.type === "file");
  if (!file) {
    fileTypeBadgeEl.textContent = "Directory";
    fileMetaEl.textContent = "";
    fileContentEl.style.display = "none";
    emptyStateEl.style.display = "flex";
    setStatus("ready", "Directory selected");
    return;
  }

  // prepare raw URL for fetching/displaying content
  const rawURL = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${rawPathEncoded}`;

  // IMAGE FILE → SHOW IMAGE (image content from raw.githubusercontent, link points to Pages)
  if (isImageFile(path)) {
    fileTypeBadgeEl.textContent = "Image";
    fileContentEl.innerHTML = `<img src="${rawURL}" style="max-width:100%;border-radius:6px;">`;
    fileContentEl.style.display = "block";
    emptyStateEl.style.display = "none";
    setStatus("ready", "Image loaded");
    return;
  }

  // BINARY FILE → SHOW WARNING (link still points to Pages)
  if (isBinaryFile(path)) {
    fileTypeBadgeEl.textContent = "Binary file";
    fileContentEl.style.display = "none";
    emptyStateEl.style.display = "flex";
    emptyStateEl.innerHTML = `
      <div>
        Cannot display raw binary.<br>
        <span style="font-size:11px;color:#ff4b6a;">Open via the RRU link or download.</span>
      </div>`;
    setStatus("ready", "Binary file");
    return;
  }

  // TEXT FILE → NORMAL BEHAVIOR
  fileTypeBadgeEl.textContent = isTextFile(path) ? "Text file" : "Plain text (unsupported ext)";
  fileMetaEl.textContent = `${file.size || 0} bytes • sha ${file.sha.slice(0, 7)}`;

  setStatus("loading", "Fetching file content...");

  try {
    const res = await fetch(rawURL);
    if (!res.ok) throw new Error("Failed to fetch file");
    const text = await res.text();
    fileContentEl.textContent = text;
    fileContentEl.style.display = "block";
    emptyStateEl.style.display = "none";
    setStatus("ready", "File loaded");
  } catch (err) {
    console.error(err);
    fileContentEl.style.display = "none";
    emptyStateEl.style.display = "flex";
    emptyStateEl.innerHTML = `<div>Failed to load file.<br/><span style="font-size:11px;color:#ff4b6a;">${err.message}</span></div>`;
    setStatus("error", "Failed to load file");
  }
}

// ---------------------------------------------------------
// OPEN BUTTONS (use same mercwar.github.io Pages URL)
// ---------------------------------------------------------
openGithubBtn.addEventListener("click", () => {
  if (!activePath) {
    window.open(`https://github.com/${CONFIG.owner}/${CONFIG.repo}`, "_blank");
    return;
  }
  const rawPathEncoded = activePath.split("/").map(encodeURIComponent).join("/");
  const pagesURL = `https://mercwar.github.io/${encodeURIComponent(CONFIG.repo)}/${rawPathEncoded}`;
  window.open(pagesURL, "_blank", "noopener");
});

openRawBtn.addEventListener("click", () => {
  if (!activePath) return;
  const rawPathEncoded = activePath.split("/").map(encodeURIComponent).join("/");
  const pagesURL = `https://mercwar.github.io/${encodeURIComponent(CONFIG.repo)}/${rawPathEncoded}`;
  window.open(pagesURL, "_blank", "noopener");
});



// ---------------------------------------------------------
// BUTTONS
// ---------------------------------------------------------
openGithubBtn.addEventListener("click", () => {
  if (!activePath) {
    window.open(`https://github.com/${CONFIG.owner}/${CONFIG.repo}`, "_blank");
    return;
  }
  window.open(
    `https://github.com/${CONFIG.owner}/${CONFIG.repo}/blob/${CONFIG.branch}/${activePath}`,
    "_blank"
  );
});

openRawBtn.addEventListener("click", () => {
  if (!activePath) return;
  const rawPath = activePath.split("/").map(encodeURIComponent).join("/");
  window.open(
    `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${rawPath}`,
    "_blank"
  );
});

// ---------------------------------------------------------
// SEARCH
// ---------------------------------------------------------
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.trim();
  renderTree(treeData, fileTreeEl, filter);
});

// ---------------------------------------------------------
// KEYBOARD SHORTCUTS
// ---------------------------------------------------------
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

// ---------------------------------------------------------
// INIT
// ---------------------------------------------------------
fetchRepoTree();

function collapseAllDropdowns() {
  document.querySelectorAll(".tree-children").forEach(el => {
    el.style.display = "none";
  });

  document.querySelectorAll(".tree-toggle").forEach(el => {
    if (!el.classList.contains("hidden")) {
      el.textContent = "▸";
    }
  });
}
function expandAllDropdowns() {
  document.querySelectorAll(".tree-children").forEach(el => {
    el.style.display = "";
  });

  document.querySelectorAll(".tree-toggle").forEach(el => {
    if (!el.classList.contains("hidden")) {
      el.textContent = "▾";
    }
  });
}
