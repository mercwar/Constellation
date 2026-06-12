/* ============================================================
   AIFVS-ARTIFACT: FILE-EXPLORER-JS
   Local File Explorer (IE/Explorer Style)
   Uses File System Access API
   ============================================================ */

let cpRootHandle = null;

/**
 * Request access to a local directory and load the tree.
 */
async function cpRequestAccess() {
    try {
        cpRootHandle = await window.showDirectoryPicker();
        const treeRoot = document.getElementById("cpFileTree");
        treeRoot.innerHTML = "";

        const tree = await cpBuildTree(cpRootHandle);
        treeRoot.appendChild(tree);

        // Hide the access button after success
        const btn = document.getElementById("cpAccessBtn");
        if (btn) btn.style.display = "none";

    } catch (err) {
        console.warn("User denied local file access:", err);
    }
}

/**
 * Build a recursive directory tree.
 */
async function cpBuildTree(dirHandle, depth = 0) {
    const container = document.createElement("div");

    for await (const entry of dirHandle.values()) {
        const li = document.createElement("li");
        li.style.marginLeft = depth * 12 + "px";

        // DIRECTORY
        if (entry.kind === "directory") {
            li.classList.add("cp-folder");
            li.innerHTML = `<span class="cp-file-icon">📁</span>${entry.name}`;

            li.onclick = async (e) => {
                e.stopPropagation();

                if (li.dataset.loaded) {
                    // collapse
                    li.nextSibling.remove();
                    delete li.dataset.loaded;
                } else {
                    // expand
                    const subtree = await cpBuildTree(entry, depth + 1);
                    li.after(subtree);
                    li.dataset.loaded = "true";
                }
            };
        }

        // FILE
        else {
            li.classList.add("cp-file");
            li.innerHTML = `<span class="cp-file-icon">📄</span>${entry.name}`;

            // Enable dragging
            li.draggable = true;
            li.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", entry.name);
            });
        }

        container.appendChild(li);
    }

    return container;
}

/* ============================================================
   INIT HOOK
   Call cpRequestAccess() when the user clicks the access button.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("cpAccessBtn");
    if (btn) {
        btn.addEventListener("click", cpRequestAccess);
    }
});
li.addEventListener("dragstart", async (e) => {
    e.stopPropagation();

    // Get the real file from the File System Access API
    const fileHandle = entry;
    const file = await fileHandle.getFile();

    const dt = e.dataTransfer;
    dt.clearData();

    // 1. Add the file as a real File object
    dt.items.add(file);

    // 2. Add fallback MIME types
    dt.setData("text/plain", file.name);
    dt.setData("DownloadURL",
        `${file.type}:${file.name}:data:${file.type};base64,`
    );

    // 3. Add a fake webkit entry (GitHub will still reject it)
    dt.items.add(new File([file], file.name, { type: file.type }));

    // 4. Try to spoof a directory entry (Chrome blocks this)
    dt.setData("application/x-moz-file", file);

    // 5. Cosmetic drag image
    const dragIcon = document.createElement("img");
    dragIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4//8/AwAI/AL+oJrVNwAAAABJRU5ErkJggg==";
    e.dataTransfer.setDragImage(dragIcon, 0, 0);
});

