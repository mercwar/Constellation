// AIFVS-ARTIFACT
// AVIS: /class/ParserHTML.js

class ParserHTML {
    static render(path) {
        UI.showHTML(`<iframe src="${path}"></iframe>`);
        UI.setStatus("HTML loaded.");
    }
}
