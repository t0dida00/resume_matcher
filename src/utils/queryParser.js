// Query parameter functions
const parseJobKeywords = (queryKeywords) => {
    return (queryKeywords || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
};

const parseAnalysisOptions = (query) => {
    return {
        keywords: parseJobKeywords(query.keywords),
        detailed: query.detailed === 'true',
        includeATS: query.includeATS !== 'false' // default to true
    };
};

module.exports = {
    parseJobKeywords,
    parseAnalysisOptions
};