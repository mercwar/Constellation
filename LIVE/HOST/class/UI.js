// AIFVS-ARTIFACT
// AVIS: /class/UI.js

class UI {

    static setStatus(msg) {
        document.getElementById("status").textContent = msg;
    }

    static showHTML(html) {
        document.getElementById("inject").innerHTML = html;
    }

    static showPre(text) {
        document.getElementById("inject").innerHTML =
            `<pre>${UI.escape(text)}</pre>`;
    }

    static escape(str) {
        return str
            .replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;");
    }

    static buildSidebar(files, callback) {
        const list = document.getElementById("sidebar-list");
        list.innerHTML = "";

        files.forEach(name => {
            const a = document.createElement("a");
            a.textContent = name;
            a.href = "#";
            a.onclick = () => callback(name);
            list.appendChild(a);
        });
    }
}
