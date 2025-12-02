
function findContactInfo(text) {
    const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi);
    const phone = text.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g);
    const linkedin = text.match(/\b(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%.]+/gi
    );
    const allWebsites = text.match(/\bhttps?:\/\/(?:www\.)?[a-z0-9-]+(?:\.[a-z]{2,})+\b/gi) || [];
    const portfolio = allWebsites.filter(url => !/linkedin\.com/i.test(url));
    return { contactInfo: { email, phone, linkedin, portfolio }, email: !!email, phone: !!phone, linkedin: !!linkedin, portfolio: !!portfolio.length };
}

function hasSections(text) {
    const sections = [
        "summary", "objective", 'about me', "profile"
        , "experience", "work experience", 'professional experience', "work history",
        "education", "skills", "projects", "certifications", "awards",
        "publications", "languages", "professional summary", , 'professional skills', 'lisences', 'additional information',
    ];
    const hits = sections.filter(s => new RegExp("\\b" + s + "\\b", "i").test(text));
    return { count: hits.length, hits };
}

function keywordCoverage(text, keywords = []) {
    const found = [];
    const missing = [];
    const lower = text.toLowerCase();
    keywords.forEach(k => {
        if (!k) return;
        const kw = String(k).trim().toLowerCase();
        if (!kw) return;
        if (lower.includes(kw)) found.push(k);
        else missing.push(k);
    });
    const coverage = keywords.length ? Math.round((found.length / keywords.length) * 100) : 0;
    return { coverage, found, missing };
}

function bulletUsage(text) {
    const bullets = (text.match(/(^|\n)\s*(?:•|-|–|\*)\s+/g) || []).length;
    const lines = text.split("\n").length;
    const ratio = lines ? bullets / lines : 0;
    return { bullets, ratio };
}

function lengthHeuristic(text) {
    const words = (text.match(/\b\w+\b/g) || []).length;
    // Rất sơ bộ: 350–900 từ là tạm ổn cho 1–2 trang
    let score = 0;
    if (words >= 350 && words <= 900) score = 1;
    else if (words >= 250 && words <= 1100) score = 0.7;
    else score = 0.4;
    return { words, score };
}

function formattingFlags(text) {
    // Cảnh báo: nhiều hình tượng/đường kẻ có thể gây khó khăn với ATS
    const badPatterns = [
        /table of contents/i, /text box/i, /header|footer/i,
        /page \d+ of \d+/i, /graphic/i
    ];
    const hits = badPatterns.filter(r => r.test(text)).length;
    return { flags: hits };
}

function scoreATS(text, opts = {}) {
    const { jobKeywords = [] } = opts;

    const contact = findContactInfo(text);
    const sections = hasSections(text);
    const keywords = keywordCoverage(text, jobKeywords);
    const bullets = bulletUsage(text);
    const len = lengthHeuristic(text);
    const fmt = formattingFlags(text);
    // Trọng số (có thể tinh chỉnh tuỳ domain)
    const weights = {
        contact: 0.15,
        sections: 0.20,
        keywords: 0.35,
        bullets: 0.10,
        length: 0.15,
        formatting: 0.05
    };

    const contactScore = (contact.email ? 0.5 : 0) + (contact.phone ? 0.3 : 0) + (contact.linkedin ? 0.2 : 0);
    const sectionsScore = Math.min(sections.count / 5, 1); // >=5 mục là đủ tốt
    const keywordsScore = (keywords.coverage || 0) / 100;
    // 5–25% dòng là bullet coi như tốt
    // const bulletsScore = bullets.ratio >= 0.05 && bullets.ratio <= 0.25 ? 1 : 0.6;
    const lengthScore = len.score;
    const formattingScore = fmt.flags === 0 ? 1 : 0.7;

    const total =
        100 * (
            contactScore * weights.contact +
            sectionsScore * weights.sections +
            keywordsScore * weights.keywords +
            // bulletsScore * weights.bullets +
            lengthScore * weights.length +
            formattingScore * weights.formatting
        );

    // Gợi ý cải thiện
    const suggestions = [];
    if (!contact.email) suggestions.push("Thêm email chuyên nghiệp ở phần đầu CV.");
    if (!contact.phone) suggestions.push("Thêm số điện thoại có mã quốc gia.");
    if (sections.count < 5) suggestions.push("Bổ sung các mục chuẩn: Summary, Experience, Education, Skills, Projects.");
    if ((keywords.coverage || 0) < 60) suggestions.push("Chèn thêm từ khoá khớp JD (đúng ngữ cảnh, tránh nhồi).");
    // if (!(bullets.ratio >= 0.05 && bullets.ratio <= 0.25)) suggestions.push("Dùng bullet points cho phần kinh nghiệm/achievements.");
    if (len.score < 1) suggestions.push("Điều chỉnh độ dài (khoảng 1–2 trang, 350–900 từ).");
    if (fmt.flags > 0) suggestions.push("Hạn chế header/footer, textbox, shape phức tạp gây lỗi với ATS.");

    return {
        overall: Math.round(total),
        breakdown: {
            contact: Math.round(contactScore * 100),
            sections: Math.round(sectionsScore * 100),
            keywords: Math.round(keywordsScore * 100),
            // bullets: Math.round(bulletsScore * 100),
            length: Math.round(lengthScore * 100),
            formatting: Math.round(formattingScore * 100),
        },
        details: { contact, sections, keywords, bullets, length: len, formatting: fmt },
        suggestions
    };
}

module.exports = { scoreATS };
