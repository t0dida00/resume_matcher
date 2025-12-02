const { hashBuffer, getCache, saveCache } = require("../utils/cache");
const { AIAnalyzer } = require("./HFAnalyzer.service");

async function JobAnalyzerService(jobDescription) {
    const hash = hashBuffer(Buffer.from(jobDescription));

    let cached = await getCache("job", hash);
    if (cached) {
        console.log("📦 JOB CACHE HIT");
        return cached;
    }

    console.log("🔄 JOB CACHE MISS — analyzing job...");

    const analysis = await AIAnalyzer("job", jobDescription);

    const result = {
        result: analysis
    };

    await saveCache("job", hash, result);
    console.log("✅ Analyzed job description and cached result");
    return result;
}
module.exports = JobAnalyzerService;