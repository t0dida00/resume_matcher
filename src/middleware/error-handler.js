const multer = require("multer");
const { ERROR_CODES, createErrorResponse } = require("../utils/errorHandler");

function errorHandler(err, req, res, next) {
    console.error("Error:", err);

    // Multer file size error
    if (err.code === "LIMIT_FILE_SIZE") {
        const errorResponse = createErrorResponse("FILE_TOO_LARGE");
        return res.status(errorResponse.status).json(errorResponse);
    }

    // Multer unexpected file error
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
        const errorResponse = createErrorResponse("INVALID_FILE_TYPE");
        return res.status(errorResponse.status).json(errorResponse);
    }

    // Custom errors with errorType
    if (err.errorType && ERROR_CODES[err.errorType]) {
        const errorResponse = createErrorResponse(err.errorType, err.message);
        return res.status(errorResponse.status).json(errorResponse);
    }

    // Default server error
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR");
    return res.status(errorResponse.status).json(errorResponse);
}

module.exports = { errorHandler };
