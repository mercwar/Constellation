// AIFVS-ARTIFACT
// AVIS: constellation.js

// AIFVS-ARTIFACT
// AVIS: constellation.js

document.addEventListener("DOMContentLoaded", () => {

    const user = "mercwar";
    const repo = "Cyborg";
    const path = "Fire-Lang";

    const surfer = new FileSurfer(user, repo, path);

    const nav = new BrowserNav((url) => surfer.navigate(url));
    nav.init();

    // expose globally
    window.browserNav = nav;

    // initial load
    surfer.loadGitHubFolder(user, repo, path);
});
