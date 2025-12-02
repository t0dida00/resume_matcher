// Error codes và status codes
const ERROR_CODES = {
    // Validation errors (400)
    INVALID_FILE: {
        code: "INVALID_FILE",
        message: "File is not a valid PDF.",
        status: 400,
    },
    NO_FILE_UPLOADED: {
        code: "NO_FILE_UPLOADED",
        message: "No file uploaded (field name should be 'file').",
        status: 400,
    },
    INVALID_FILE_TYPE: {
        code: "INVALID_FILE_TYPE",
        message: "Only PDF files are allowed.",
        status: 400,
    },
    UPLOAD_ERROR: {
        code: "UPLOAD_ERROR",
        message: "Upload error occurred.",
        status: 400,
    },

    // File size errors (413)
    FILE_TOO_LARGE: {
        code: "FILE_TOO_LARGE",
        message: "PDF too large.",
        status: 413,
    },

    // Server errors (500)
    PARSE_ERROR: {
        code: "PARSE_ERROR",
        message: "Failed to parse PDF.",
        status: 500,
    },
    INTERNAL_SERVER_ERROR: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error.",
        status: 500,
    },
};

// Hàm tạo error response
function createErrorResponse(errorType, customMessage = null) {
    const error = ERROR_CODES[errorType];
    if (!error) {
        return {
            success: false,
            error: "Unknown error",
            status: 500,
            code: "UNKNOWN_ERROR",
        };
    }

    return {
        success: false,
        error: customMessage || error.message,
        status: error.status,
        code: error.code,
    };
}

// Hàm tạo success response
function createSuccessResponse(data = {}) {
    return {
        success: true,
        status: 201,
        ...data,
    };
}

// Express error middleware
function errorMiddleware(err, req, res, next) {
    console.error("Error:", err);

    // Multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
        const errorResponse = createErrorResponse("FILE_TOO_LARGE");
        return res.status(errorResponse.status).json(errorResponse);
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
        const errorResponse = createErrorResponse("INVALID_FILE_TYPE");
        return res.status(errorResponse.status).json(errorResponse);
    }

    // Custom errors
    if (err.errorType && ERROR_CODES[err.errorType]) {
        const errorResponse = createErrorResponse(err.errorType, err.message);
        return res.status(errorResponse.status).json(errorResponse);
    }

    // Default error
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR");
    return res.status(errorResponse.status).json(errorResponse);
}

module.exports = {
    ERROR_CODES,
    createErrorResponse,
    createSuccessResponse,
    errorMiddleware,
};
