const buildRecruiterPrompt = (cvText) => `
Extract CV data and output ONLY this JSON (all lowercase):

{
  "detail": {
    "contact": {
      "contactInfo": {
        "email": [], "phone": [], "linkedin": [], "portfolio": []
      },
      "email": true, "phone": true, "linkedin": true, "portfolio": true
    }
  },
  "sections": { "count": 0, "hits": [] },
  "ats": {
    "field": [], "position": [], "level": [], "keywords": [],
    "softSkills": [], "education": [], "languages": []
  }
}

RULES:
- extract ONLY info explicitly in CV.
- contact: email has "@"; phone = valid number; linkedin has "linkedin.com"; portfolio = personal/professional site (no drive/dropbox).
- sections: detect common CV sections (summary, experience, education, skills, projects, awards, languages, certifications, etc.).
- ats:
  field = industries; 
  position = job titles; 
  level = intern/trainee/junior/middle/senior/lead or "none specified";
  keywords = ONLY core technical skills/tools (main keywords);
  softSkills = interpersonal skills only;
  education = institution names;
  languages = listed or default ["english"].
"""
${cvText}
"""
`.trim();

module.exports = { buildRecruiterPrompt };