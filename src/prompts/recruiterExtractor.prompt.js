const buildRecruiterPrompt = (cvText) => `
Extract cv data and output only this json (all lowercase): { "detail": { "contact": { "contactinfo": { "email": [], "phone": [], "linkedin": [], "portfolio": [] }, "email": true, "phone": true, "linkedin": true, "portfolio": true } }, "sections": { "count": 0, "hits": [] }, "ats": { "field": [], "position": [], "level": [], "keywords": [], "softskills": [], "education": [], "languages": [] } } rules: - extract only info explicitly in cv. - contact: email has "@"; phone = valid number; linkedin has "linkedin.com"; portfolio = personal/professional site (no drive/dropbox). - sections: detect common cv sections (summary, experience, education, skills, projects, awards, languages, certifications, etc.). - ats: field = industries; position = job titles; level = intern/trainee/junior/middle/senior/lead or "none specified"; keywords = only core technical skills/tools (main keywords); softskills = interpersonal skills only; education = institution names; languages = listed or default ["english"]. make it plaintext, without breakpoint, just continue string

"""
${cvText}
"""
`.trim();

module.exports = { buildRecruiterPrompt };