// AIFVS-ARTIFACT
// AVIS: /class/GitHubAPI.js

// AIFVS-ARTIFACT
// AVIS: /class/GitHubAPI.js

class GitHubAPI {

    static async listDirectory(user, repo, path = "") {
        const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error("GitHub API error: " + res.status);
        }

        return await res.json();
    }
}
