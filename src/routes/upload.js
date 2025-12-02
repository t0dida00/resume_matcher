// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const { isPdfBuffer } = require("../utils/pdfValidator");
// const { parsePDF } = require("../utils/pdfParser");
// const { UPLOAD_DIR, MAX_FILE_SIZE, ALLOWED_MIME_TYPES } = require("../config/env");
// const { createErrorResponse, createSuccessResponse } = require("../utils/errorHandler");

// const router = express.Router();

// // Tạo thư mục uploads nếu chưa tồn tại
// if (!fs.existsSync(UPLOAD_DIR)) {
//     fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// }

// // Cấu hình multer với memory storage
// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: MAX_FILE_SIZE },
//     fileFilter: (req, file, cb) => {
//         // Kiểm tra MIME type (client có thể giả mạo, ta sẽ xác minh lại sau)
//         if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only PDFs allowed"));
//         }
//     },
// });

// // POST endpoint để upload PDF
// router.post("/", upload.single("file"), async (req, res, next) => {
//     try {
//         if (!req.file) {
//             const errorResponse = createErrorResponse("NO_FILE_UPLOADED");
//             return res.status(errorResponse.status).json(errorResponse);
//         }

//         // Xác minh chữ ký PDF thực tế
//         if (!isPdfBuffer(req.file.buffer)) {
//             const errorResponse = createErrorResponse("INVALID_FILE");
//             return res.status(errorResponse.status).json(errorResponse);
//         }

//         // Làm sạch filename và lưu file
//         const base = path.basename(req.file.originalname).replace(/[^\w.\-]/g, "_");
//         const filename = `${Date.now()}_${base || "upload.pdf"}`;
//         const outPath = path.join(UPLOAD_DIR, filename);

//         fs.writeFileSync(outPath, req.file.buffer);

//         // Parse PDF để lấy thông tin
//         const pdfInfo = await parsePDF(req.file.buffer);

//         const response = createSuccessResponse({
//             message: "PDF uploaded and parsed",
//             filename,
//             path: `/uploads/${filename}`,
//             pdfInfo,
//         });

//         return res.status(response.status).json(response);
//     } catch (err) {
//         next(err);
//     }
// }, (err, req, res, next) => {
//     // Error handler cho multer
//     if (err instanceof multer.MulterError) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//             const errorResponse = createErrorResponse("FILE_TOO_LARGE");
//             return res.status(errorResponse.status).json(errorResponse);
//         }
//         if (err.code === "LIMIT_UNEXPECTED_FILE") {
//             const errorResponse = createErrorResponse("INVALID_FILE_TYPE");
//             return res.status(errorResponse.status).json(errorResponse);
//         }
//         const errorResponse = createErrorResponse("UPLOAD_ERROR", err.message);
//         return res.status(errorResponse.status).json(errorResponse);
//     }
//     // Pass to next error handler
//     next(err);
// });

// module.exports = router;
