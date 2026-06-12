/* ============================================================
   AIFVS-ARTIFACT: AJAX-INTERFACE
   AJAX HTML Loader Interface for Constellation
   Provides: printAjaxHTML, printAjaxHTMLPost, appendAjaxHTML
   ============================================================ */

function printAjaxHTML(url, targetSelector) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const target = document.querySelector(targetSelector);
            if (target) {
                target.innerHTML = html;
            } else {
                console.error("Target not found:", targetSelector);
            }
        })
        .catch(err => {
            console.error("AJAX HTML load failed:", err);
        });
}

function printAjaxHTMLPost(url, data, targetSelector) {
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data)
    })
    .then(r => r.text())
    .then(html => {
        const target = document.querySelector(targetSelector);
        if (target) {
            target.innerHTML = html;
        } else {
            console.error("Target not found:", targetSelector);
        }
    })
    .catch(err => console.error("AJAX POST load failed:", err));
}

function appendAjaxHTML(url, targetSelector) {
    fetch(url)
        .then(r => r.text())
        .then(html => {
            const target = document.querySelector(targetSelector);
            if (target) {
                target.insertAdjacentHTML("beforeend", html);
            } else {
                console.error("Target not found:", targetSelector);
            }
        })
        .catch(err => console.error("AJAX append failed:", err));
}

/* ============================================================
   Example usage:
   printAjaxHTML("myfile.html", ".centerpiece-files");
   printAjaxHTMLPost("load.php", { id: 5 }, ".centerpiece-files");
   appendAjaxHTML("footer.html", ".centerpiece-files");
   ============================================================ */
function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
            clearInterval(interval);
            callback(el);
        }
    }, 30);
}

/*
   Example usage:
printAjaxHTML("hub.html?v=2", "#hub-drop");
printAjaxHTML("portal.html?v=2", "#portal-drop");
printAjaxHTML("repo.html?v=2", "#repo-drop");

waitForElements([
    "#hub-drop",
    "#portal-drop",
    "#repo-drop"
], () => {
    console.log("All AJAX elements loaded.");
    // put your button logic here
});

*/