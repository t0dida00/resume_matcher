export function extractJson(text) {
    if (typeof text !== "string") return null;
    const m = text.match(/\{[\s\S]*\}$/);
    const body = m ? m[0] : text;
    try { return JSON.parse(body); }
    catch { return null; }
}
