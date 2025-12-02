const { createErrorResponse } = require("../utils/errorHandler");

function isPdfBuffer(buf) {
    if (!buf || buf.length < 5) return false;
    return buf.subarray(0, 5).toString("ascii") === "%PDF-";
}

function pdfGuard(req, res, next) {
    const file = req.file;
    if (!file) {
        const errorResponse = createErrorResponse("NO_FILE_UPLOADED");
        return res.status(errorResponse.status).json(errorResponse);
    }
    if (!isPdfBuffer(file.buffer)) {
        const errorResponse = createErrorResponse("INVALID_FILE");
        return res.status(errorResponse.status).json(errorResponse);
    }
    next();
}

module.exports = { pdfGuard };
