const multer = require("multer");
const cfg = require("../config/env");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: cfg.maxFileSizeBytes, files: 1 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") return cb(null, true);
        return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only PDFs allowed"));
    },
});

module.exports = upload;
