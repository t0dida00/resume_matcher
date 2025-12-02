const HEADINGS = {
    summary: ["summary", "profile", "objective", "tóm tắt", "giới thiệu"],
    skills: ["skills", "kỹ năng", "competencies", "strengths"],
    experience: ["experience", "work history", "employment", "kinh nghiệm"],
    education: ["education", "học vấn", "studies", "degrees"],
    certifications: ["certifications", "chứng chỉ", "licenses", "courses", "projects", "dự án"]
};

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(\+?\d[\d ()-]{7,}\d)/;
const URL_RE = /(https?:\/\/\S+|linkedin\.com\/\S+|github\.com\/\S+)/ig;

function splitSections(text) {
    const lines = String(text || "").split("\n").map(l => l.trim()).filter(Boolean);
    const marks = [];
    for (let i = 0; i < lines.length; i++) {
        const low = lines[i].toLowerCase();
        Object.keys(HEADINGS).forEach(k => {
            if (HEADINGS[k].some(h => low === h || low.includes(h))) marks.push({ i, key: k });
        });
    }
    marks.sort((a, b) => a.i - b.i);
    const out = { summary: "", skills: "", experience: "", education: "", certifications: "" };
    for (let m = 0; m < marks.length; m++) {
        const { i, key } = marks[m];
        const j = marks[m + 1]?.i ?? lines.length;
        out[key] = lines.slice(i + 1, j).join("\n").trim();
    }
    return out;
}

function parseContact(full) {
    const email = String(full || "").match(EMAIL_RE)?.[0] ?? null;
    const phone = String(full || "").match(PHONE_RE)?.[0] ?? null;
    const links = Array.from(String(full || "").matchAll(URL_RE)).map(m => m[0]);
    return { email, phone, links: [...new Set(links)], name: null, location: null };
}

module.exports = { splitSections, parseContact };