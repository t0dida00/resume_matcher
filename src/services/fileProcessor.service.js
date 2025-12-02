const path = require("path");
const { parsePDF } = require("../utils/pdfParser");
const { saveBufferToUploads } = require("./storage.service");
const { sanitizeFilename } = require("../utils/sanitize");
const { cleanText } = require("./text.service");

// Validation functions
const validateFile = (file) => {
    if (!file || !file.buffer) {
        throw new Error("NO_FILE_UPLOADED");
    }
};

// Text processing functions
const extractTextFromPDF = async (buffer) => {
    const parsed = await parsePDF(buffer);

    if (!parsed.success) {
        throw new Error(`PARSE_ERROR: ${parsed.error}`);
    }

    return parsed.text || "";
};

const calculateWordCount = (text) => {
    return (text.match(/\b\w+\b/g) || []).length;
};

// File handling functions
const saveUploadedFile = (originalname, buffer) => {
    const base = sanitizeFilename(path.basename(originalname));
    const filename = `${Date.now()}_${base || "cv.pdf"}`;
    const filePath = saveBufferToUploads(filename, buffer);

    return { filename, path: filePath };
};

// Process uploaded file comprehensively
const processUploadedFile = async (file) => {
    validateFile(file);

    const { buffer, originalname } = file;

    // Extract text from PDF
    const rawText = await extractTextFromPDF(buffer);
    const cleanedText = cleanText(rawText);
    const wordCount = calculateWordCount(cleanedText);

    // Save file to storage
    const savedFile = saveUploadedFile(originalname, buffer);

    return {
        rawText,
        cleanedText,
        wordCount,
        savedFile
    };
};

module.exports = {
    validateFile,
    extractTextFromPDF,
    calculateWordCount,
    saveUploadedFile,
    processUploadedFile
};