const { analyzeCVWithAI, checkHFServiceHealth } = require("../services/HFAnalyzer.service");
const { processUploadedFile } = require("../services/fileProcessor.service");
const { parseAnalysisOptions } = require("../utils/queryParser");
const { createSuccessResponse, createErrorResponse } = require("../utils/errorHandler");

// Main controller function
async function reviewCV(req, res, next) {
    try {
        const { file, query } = req;

        // Process uploaded file
        const fileProcessingResult = await processUploadedFile(file);
        const { cleanedText, wordCount, savedFile } = fileProcessingResult;

        // Parse query options
        const analysisOptions = parseAnalysisOptions(query);

        // Analyze CV with AI
        const analysisResult = await analyzeCVWithAI(cleanedText);

        // Calculate ATS score if requested
        let atsScore = null;
        if (analysisOptions.includeATS && analysisOptions.keywords.length > 0) {
            // const ats = scoreATS(cleanedText, { jobKeywords: analysisOptions.keywords });
            // atsScore = ats; // Uncomment when ATS service is ready
        }

        // Prepare response data
        const responseData = {
            words: wordCount,
            result: analysisResult,
        };

        // Add ATS score if available
        if (atsScore) {
            responseData.ats = atsScore;
        }

        // Add detailed analysis if requested
        if (analysisOptions.detailed) {
            responseData.detailed = {
                jobKeywords: analysisOptions.keywords,
                analysisTimestamp: new Date().toISOString()
            };
        }

        // Return success response
        const successResponse = createSuccessResponse(responseData);
        return res.status(successResponse.status).json(successResponse);

    } catch (error) {
        handleCVReviewError(error, res, next);
    }
}

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

module.exports = {
    reviewCV,
    healthCheck
};