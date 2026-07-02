const owner       = "mercwar";
const repo        = "Constellation";
const maxVersions = 12;
const imageExts   = ["jpg","jpeg","png","gif","webp","bmp"];
const app_name   = "void-star";

let currentVersion = null;
let files = [];
let page  = 1;
const pageSize = 5;   // ONLY SHOW 5 IMAGES (Updated from comment mismatches)

function ghList(path=""){
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
    return fetch(url).then(r=>r.json());
}

function isImageFile(name){
    const ext = name.split(".").pop().toLowerCase();
    return imageExts.includes(ext);
}

function isVersionDir(name){
    const m = /^Images\s+(\d+)$/i.exec(name);
    if(!m) return false;
    const n = parseInt(m[1], 10);
    return n >= 1 && n <= maxVersions;
}

function buildVersionBar(){
    const bar = document.getElementById("versionBar");
    if (!bar) return; // Prevent errors if DOM isn't ready
    bar.textContent = "Loading versions…";

    // CHANGE: If your "Images X" folders are inside the "fire-star" folder on GitHub, 
    // change ghList("") below to ghList("fire-star")
    ghList("void-star").then(items=>{
        if (!Array.isArray(items)) {
            bar.textContent = "Failed to parse repository structure.";
            return;
        }

        const versions = items
            .filter(i => i.type==="dir" && isVersionDir(i.name))
            .sort((a,b)=>{
                const na = parseInt(a.name.split(" ")[1],10);
                const nb = parseInt(b.name.split(" ")[1],10);
                return na - nb;
            });

        bar.textContent = "";
        versions.forEach(v=>{
            const btn = document.createElement("button");
            btn.textContent = v.name;
            btn.onclick = () => {
                currentVersion = v;
                page = 1;
                document.querySelectorAll("#versionBar button").forEach(b=>b.classList.remove("active"));
                btn.classList.add("active");
                loadImages();
            };
            bar.appendChild(btn);
        });

        if(versions[0]){
            bar.querySelector("button").click();
        } else {
            bar.textContent = "No Image version directories found.";
        }
    }).catch(err => {
        bar.textContent = "Error connecting to GitHub API.";
        console.error(err);
    });
}

function loadImages(){
    if(!currentVersion) return;
    ghList(currentVersion.path).then(items=>{
        files = items.filter(i => i.type==="file" && isImageFile(i.name));
        page = 1;
        renderGrid();
    });
}

function renderGrid(){
    const grid = document.getElementById("grid");
    if (!grid) return;
    grid.innerHTML = "";

    const start = (page-1)*pageSize;
    const end   = start + pageSize;
    const pageFiles = files.slice(start,end);

    pageFiles.forEach(item=>{
        const img = document.createElement("img");
        img.src = item.download_url;
        img.className = "thumb";
        img.onclick = () => openLightbox(item.download_url);
        grid.appendChild(img);
    });

    const totalPages = Math.max(1, Math.ceil(files.length/pageSize));
    const pageInfo = document.getElementById("pageInfo");
    if (pageInfo) {
        pageInfo.textContent = `${page} OF ${totalPages}`;
    }
}

function openLightbox(src){
    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lbImg");
    if (lb && lbImg) {
        lbImg.src = src;
        lb.style.display = "flex";
    }
}

// Safely attach event listeners after the document finishes loading
document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.onclick = () => {
            lightbox.style.display = "none";
        };
    }

    const prevBtn = document.getElementById("prevBtn");
    if (prevBtn) {
        prevBtn.onclick = () => {
            if(page>1){ page--; renderGrid(); }
        };
    }

    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) {
        nextBtn.onclick = () => {
            if(page < Math.ceil(files.length/pageSize)){ page++; renderGrid(); }
        };
    }

    buildVersionBar();
});
