const { hashBuffer, getCache, saveCache } = require("../utils/cache");
const { processUploadedFile } = require("./fileProcessor.service");
const { AIAnalyzer } = require("./HFAnalyzer.service");

async function CVAnalyzerService(file) {
    const hash = hashBuffer(file.buffer);

    let cached = await getCache("cv", hash);
    if (cached) {
        console.log("📌 CV CACHE HIT");
        return cached;
    }

    console.log("📌 CV CACHE MISS — processing CV...");
    const processedCV = await processUploadedFile(file);
    const analysis = await AIAnalyzer("cv", processedCV.cleanedText);

    const result = {
        words: processedCV.wordCount,
        result: analysis
    };

    await saveCache("cv", hash, result);
    console.log("📌 Analyzed CV and cached result");
    return result;
}
module.exports = CVAnalyzerService;