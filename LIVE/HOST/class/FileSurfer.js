// AIFVS-ARTIFACT
// AVIS: /class/FileSurfer.js

class FileSurfer {

    constructor(user, repo, rootPath = "") {
        this.user = user;
        this.repo = repo;
        this.rootPath = rootPath;
    }

    setNav(url) {
        if (window.browserNav) {
            window.browserNav.navigate(url);
        }
    }

    navigate(url) {
        // BrowserNav already updated state
        if (url.startsWith("gh:")) {
            const parts = url.replace("gh:", "").split("/");
            const user = parts[0];
            const repo = parts[1];
            const folder = parts.slice(2).join("/");
            this.loadGitHubFolder(user, repo, folder);
            return;
        }

        if (url.startsWith("http://") || url.startsWith("https://")) {
            ParserHTML.render(url);
            return;
        }

        this.loadFileFromGitHub(this.user, this.repo, this.rootPath, url);
    }

    async init() {
        UI.setStatus("Fetching directory tree…");

        try {
            const items = await GitHubAPI.listDirectory(this.user, this.repo, this.rootPath);

            const files = items
                .filter(i => i.type === "file")
                .map(i => i.name);

            UI.buildSidebar(files, (file) =>
                this.loadFileFromGitHub(this.user, this.repo, this.rootPath, file)
            );

            UI.setStatus("Directory loaded.");
        } catch (err) {
            UI.setStatus("Failed: " + err);
        }
    }

    async loadGitHubFolder(user, repo, folder) {
        UI.setStatus("Loading GitHub folder: " + folder);

        try {
            const items = await GitHubAPI.listDirectory(user, repo, folder);

            const files = items
                .filter(i => i.type === "file")
                .map(i => i.name);

            UI.buildSidebar(files, (file) =>
                this.loadFileFromGitHub(user, repo, folder, file)
            );

            UI.setStatus("Folder loaded.");
        } catch (err) {
            UI.setStatus("GitHub load failed: " + err);
        }
    }

    loadFileFromGitHub(user, repo, folder, name) {
        const path = `https://raw.githubusercontent.com/${user}/${repo}/main/${folder}/${name}`;
        this.loadFile(path, name);
    }

    loadFile(path, nameOverride = null) {
        const name = nameOverride || path.split("/").pop();
        const lower = name.toLowerCase();

        this.setNav(path);
        UI.setStatus("Loading: " + path);

        if (lower.endsWith(".html") || lower.endsWith(".htm")) {
            ParserHTML.render(path);
            return;
        }

        if (lower.match(/\.(png|jpg|jpeg|gif)$/)) {
            ParserImage.render(path);
            return;
        }

        fetch(path)
            .then(res => res.text())
            .then(text => this.renderTextFile(name, text))
            .catch(err => UI.setStatus("Load failed: " + err));
    }

    renderTextFile(name, content) {
        const lower = name.toLowerCase();

        if (lower.endsWith(".json")) {
            ParserJSON.render(content);
            return;
        }

        if (lower.endsWith(".md")) {
            ParserMarkdown.render(content);
            return;
        }

        ParserText.render(content);
    }
}
