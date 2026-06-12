// AIFVS-ARTIFACT
// AVIS: /class/ParserImage.js

class ParserImage {
    static render(path) {
        UI.showHTML(`<img src="${path}" style="max-width:100%;">`);
        UI.setStatus("Image loaded.");
    }
}
