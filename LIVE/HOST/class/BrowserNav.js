// AIFVS-ARTIFACT
// AVIS: /class/BrowserNav.js

class BrowserNav {

    constructor(onNavigate) {
        this.history = [];
        this.index = -1;
        this.onNavigate = onNavigate;

        this.state = {
            url: "",
            index: 0,
            length: 0
        };
    }

    init() {
        window.browserNav = this;

        document.getElementById("nav-go").onclick = () => {
            const url = document.getElementById("nav-url").value.trim();
            this.navigate(url);
        };

        document.getElementById("nav-back").onclick = () => this.back();
        document.getElementById("nav-forward").onclick = () => this.forward();
        document.getElementById("nav-reload").onclick = () => this.reload();
        document.getElementById("nav-home").onclick = () => this.navigate("");

        this.updateInfo();
    }

    updateInfo() {
        document.getElementById("nav-info-url").textContent = this.state.url || "none";
        document.getElementById("nav-info-index").textContent = this.state.index;
        document.getElementById("nav-info-length").textContent = this.state.length;
    }

    navigate(url) {
        if (!url) url = "";

        this.history = this.history.slice(0, this.index + 1);
        this.history.push(url);
        this.index++;

        this.state.url = url;
        this.state.index = this.index;
        this.state.length = this.history.length;

        this.updateInfo();
        document.getElementById("nav-url").value = url;

        this.onNavigate(url);
    }

    back() {
        if (this.index > 0) {
            this.index--;
            const url = this.history[this.index];

            this.state.url = url;
            this.state.index = this.index;
            this.state.length = this.history.length;

            this.updateInfo();
            document.getElementById("nav-url").value = url;

            this.onNavigate(url);
        }
    }

    forward() {
        if (this.index < this.history.length - 1) {
            this.index++;
            const url = this.history[this.index];

            this.state.url = url;
            this.state.index = this.index;
            this.state.length = this.history.length;

            this.updateInfo();
            document.getElementById("nav-url").value = url;

            this.onNavigate(url);
        }
    }

    reload() {
        if (this.index >= 0) {
            const url = this.history[this.index];
            this.state.url = url;
            this.updateInfo();
            this.onNavigate(url);
        }
    }
}
