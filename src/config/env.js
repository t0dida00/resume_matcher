// Hằng số cấu hình
const path = require("path");

// module.exports = {
//     UPLOAD_DIR: path.join(__dirname, "..", "uploads"),
//     MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
//     PORT: process.env.PORT || 3000,
//     ALLOWED_MIME_TYPES: ["application/pdf"],
// };

module.exports = {
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 3000),
    uploadDir: path.resolve(process.env.UPLOAD_DIR || "uploads"),
    maxFileSizeBytes: Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024,
    hfToken: process.env.HF_TOKEN || "",
    hfModel: process.env.HF_MODEL || "openai/gpt-oss-120b:fastest",
};