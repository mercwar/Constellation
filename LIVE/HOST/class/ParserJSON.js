// AIFVS-ARTIFACT
// AVIS: /class/ParserJSON.js

class ParserJSON {
    static render(content) {
        const pretty = JSON.stringify(JSON.parse(content), null, 2);
        UI.showPre(pretty);
        UI.setStatus("JSON loaded.");
    }
}
