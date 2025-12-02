/**
 * 🔧 URL Helper Utilities
 * Handles extraction and normalization of any domain URLs (excluding LinkedIn)
 * Works with http(s), www, subdomains, punycode, and arbitrary TLDs.
 */

/** Clean trailing punctuation like ")" or "." after URLs */
function trimUrlPunctuation(u) {
    return u.replace(/[),.;:!?]+$/g, "");
}

/** Ensure URLs have a protocol for proper parsing */
function ensureProtocol(u) {
    return /^https?:\/\//i.test(u) ? u : "https://" + u;
}

/** Convert a URL string into its origin (scheme + host only) */
function toOrigin(u) {
    try {
        const url = new URL(ensureProtocol(u));
        return `${url.protocol}//${url.host}`;
    } catch {
        return null;
    }
}

/** Extract all domain URLs (protocol or bare) and normalize to origin */
function extractAllDomains(text) {
    if (!text) return [];

    const matches = [
        // With protocol
        ...text.matchAll(/\bhttps?:\/\/[^\s)]+/gi),
        // Bare domains (optional www)
        ...text.matchAll(/\b(?:www\.)?(?:[a-z0-9-]+\.)+[a-z0-9-]{2,}(?:\/[^\s)]*)?/gi),
    ];

    const seen = new Set();
    const out = [];

    for (const m of matches) {
        const raw = trimUrlPunctuation(m[0]);

        // Skip emails like "name@example.com"
        if (/\S+@\S+\.\S+/.test(raw)) continue;

        const origin = toOrigin(raw);
        if (!origin) continue;

        const key = origin.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            out.push(origin);
        }
    }

    return out;
}

/** Split all sites into LinkedIn and portfolio lists */
function extractAllSites(text) {
    const allSites = extractAllDomains(text);

    const linkedin = allSites.filter(u => /(?:^https?:\/\/)?(?:www\.)?linkedin\.com$/i.test(u));
    const portfolio = allSites.filter(u => !/linkedin\.com$/i.test(new URL(u).host));

    return { linkedin, portfolio };
}

module.exports = {
    trimUrlPunctuation,
    ensureProtocol,
    toOrigin,
    extractAllDomains,
    extractAllSites,
};
