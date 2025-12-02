const buildJobPrompt = (jobDescription) => `
Analyze the job description and output ONLY this JSON (all lowercase):

{
  "job": {
    "field": [],
    "position": [],
    "level": [],
    "keywords": [],
    "softSkills": [],
    "languages": []
  }
}

RULES:
- extract ONLY what appears in the job text.
- field = industry/domain (e.g., software development, frontend, marketing).
- position = job titles mentioned.
- level = intern/trainee/junior/middle/senior/lead or "none specified".
- keywords = core technical skills, tools, frameworks, languages, platforms.
- softSkills = interpersonal skills mentioned.
- languages = languages required or preferred.

Return only the JSON.
JOB TEXT:
"""
${jobDescription}
"""
`.trim();

module.exports = { buildJobPrompt };