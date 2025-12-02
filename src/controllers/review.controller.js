const { AIAnalyzer, checkHFServiceHealth } = require("../services/HFAnalyzer.service");
const { processUploadedFile } = require("../services/fileProcessor.service");
const { parseAnalysisOptions } = require("../utils/queryParser");
const { createSuccessResponse, createErrorResponse } = require("../utils/errorHandler");
const crypto = require("crypto");
const redis = require("../clients/redis.client"); // <-- Add Redis client
// Main controller function
async function reviewCV(req, res, next) {
    try {
        const { file } = req;
        const { jobDescription } = req.body;

        if (!file) {
            const errorResponse = createErrorResponse("NO_FILE_UPLOADED");
            return res.status(errorResponse.status).json(errorResponse);
        }
        if (!jobDescription) {
            const errorResponse = createErrorResponse("INVALID_REQUEST", "jobDescription is required");
            return res.status(errorResponse.status).json(errorResponse);
        }

        // STEP 1 — Compute hashes
        const CVHash = hashBuffer(file.buffer);
        const JobHash = hashBuffer(Buffer.from(jobDescription));

        // STEP 2 — Check Redis for CV + Job cache
        let CVcached = await getCachedResult("cv", CVHash);
        let Jobcached = await getCachedResult("job", JobHash);

        console.log("CV cache?", !!CVcached);
        console.log("Job cache?", !!Jobcached);

        // STEP 3 — Process CV if not cached
        if (!CVcached) {
            console.log("📌 CV CACHE MISS — processing CV...");
            const processedCV = await processUploadedFile(file);

            // Run AI on CV text
            const CVanalysis = await AIAnalyzer("cv", processedCV.cleanedText);

            CVcached = {
                words: processedCV.wordCount,
                result: CVanalysis
            };

            await cacheResult("cv", CVHash, CVcached);
        }

        // STEP 4 — Process Job if not cached
        if (!Jobcached) {
            console.log("📌 JOB CACHE MISS — processing job description...");

            // Run AI on job description
            const jobAnalysis = await AIAnalyzer("job", jobDescription);

            Jobcached = {
                result: jobAnalysis
            };

            await cacheResult("job", JobHash, Jobcached);
        }

        // STEP 5 — Return both separately
        const successResponse = createSuccessResponse({
            cv: CVcached,
            job: Jobcached
        });

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