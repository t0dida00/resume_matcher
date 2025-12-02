// Polyfill for Node.js (pdf-parse needs DOMMatrix)
if (typeof global !== "undefined" && !global.DOMMatrix) {
    global.DOMMatrix = class DOMMatrix {
        constructor(init) {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
            if (Array.isArray(init) && init.length === 6) {
                [this.a, this.b, this.c, this.d, this.e, this.f] = init;
            }
        }
    };
}

// Load .env so process.env values (e.g. HF_TOKEN) are available
try {
    require("dotenv").config();
} catch (e) {
    // ignore if dotenv missing
}

const cfg = require("./config/env");
const app = require("./app");

app.listen(cfg.port, () => {
    console.log(`CV Review server running at http://localhost:${cfg.port}`);
});