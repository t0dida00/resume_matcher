// Một số bước làm sạch cơ bản cho ATS:
// - Chuẩn hoá xuống dòng, khoảng trắng
// - Gộp từ bị ngắt dòng "devel-\nopment" -> "development"
// - Loại bỏ nhiều dấu chấm/emoji/biểu tượng lạ quá mức (tuỳ mức độ)
function normalizeWhitespace(text) {
    return text
        .replace(/\r/g, "\n")
        .replace(/[•▪●◦►◆■□–—-]/g, "•") // unify all bullets/dashes into a standard "•"
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
}

function fixHyphenation(text) {
    // ghép từ bị ngắt dòng bởi dấu gạch nối ở cuối dòng
    return text.replace(/([A-Za-z])-\n([A-Za-z])/g, "$1$2");
}

function stripExcessSymbols(text) {
    // giữ lại chữ, số, dấu câu cơ bản
    return text.replace(/[^\S\r\n]*[•▪●◦►◆■□–—-][^\S\r\n]*/g, "• ")
        .replace(/[^\x09\x0A\x0D\x20-\x7EÀ-ž€₫₤₦₩₹¥£¢©®™–—•…·’“”‘‚„]/g, "");
}

function cleanText(text) {
    let t = text || "";
    t = fixHyphenation(t);
    t = stripExcessSymbols(t);
    t = normalizeWhitespace(t);
    return t;
}

module.exports = { cleanText };
