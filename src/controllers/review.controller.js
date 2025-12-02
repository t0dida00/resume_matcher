const { AIAnalyzer, checkHFServiceHealth } = require("../services/HFAnalyzer.service");
const { processUploadedFile } = require("../services/fileProcessor.service");
const { parseAnalysisOptions } = require("../utils/queryParser");
const { createSuccessResponse, createErrorResponse } = require("../utils/errorHandler");
const crypto = require("crypto");
const redis = require("../clients/redis.client"); // <-- Add Redis client
const CVAnalyzerService = require("../services/CVAnalyzer.service");
// Main controller function
const JobAnalyzerService = require("../services/JobAnalyzer.service");
async function reviewCV(req, res, next) {
    try {
        const { file } = req;
        const { jobDescription } = req.body;

        if (!file)
            return res.status(400).json(createErrorResponse("NO_FILE_UPLOADED"));
        if (!jobDescription)
            return res.status(400).json(createErrorResponse("INVALID_REQUEST", "jobDescription required"));

        const cv = await CVAnalyzerService(file);
        const job = await JobAnalyzerService(jobDescription);

        const successResponse = createSuccessResponse({ cv, job });
        return res.status(successResponse.status).json(successResponse);

    } catch (error) {
        next(error);
    }
}

module.exports = { reviewCV };

// Error handling function
function handleCVReviewError(error, res, next) {
    // Handle specific error types
    if (error.message === "HF_TOKEN not configured") {
        const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", error.message);
        return res.status(errorResponse.status).json(errorResponse);
    }

    if (error.message === "NO_FILE_UPLOADED") {
        const errorResponse = createErrorResponse("NO_FILE_UPLOADED");
        return res.status(errorResponse.status).json(errorResponse);
    }

    if (error.message.startsWith("PARSE_ERROR")) {
        const errorResponse = createErrorResponse("PARSE_ERROR", error.message);
        return res.status(errorResponse.status).json(errorResponse);
    }

    // Pass other errors to the global error handler
    next(error);
}

// Health check endpoint
async function healthCheck(req, res) {
    try {
        const { checkHFServiceHealth } = require("../services/HFAnalyzer.service");
        const hfHealth = await checkHFServiceHealth();

        const healthStatus = {
            status: "OK",
            timestamp: new Date().toISOString(),
            services: {
                huggingFace: hfHealth
            }
        };

        return res.status(200).json(healthStatus);
    } catch (error) {
        return res.status(503).json({
            status: "SERVICE_UNAVAILABLE",
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
}

const hashBuffer = (buffer) => {
    return crypto.createHash("sha256").update(buffer).digest("hex");
};

// Check cache before doing heavy work
const getCachedResult = async (key = "cv", hash) => {
    const cached = await redis.get(`${key}:${hash}`);
    return cached ? JSON.parse(cached) : null;
};

// Save result to Redis
const cacheResult = async (key = "cv", hash, result) => {
    await redis.set(`${key}:${hash}`, JSON.stringify(result), "EX", 86400);
    // Cache for 1 day
};
module.exports = {
    reviewCV,
    healthCheck
};