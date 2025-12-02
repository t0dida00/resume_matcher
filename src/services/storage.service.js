const fs = require("fs");
const path = require("path");
const cfg = require("../config/env");

function ensureUploadDir() {
    if (!fs.existsSync(cfg.uploadDir)) fs.mkdirSync(cfg.uploadDir, { recursive: true });
}

function saveBufferToUploads(filename, buffer) {
    ensureUploadDir();
    const outPath = path.join(cfg.uploadDir, filename);
    fs.writeFileSync(outPath, buffer);
    return outPath;
}

module.exports = { ensureUploadDir, saveBufferToUploads };
