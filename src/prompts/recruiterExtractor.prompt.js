const buildRecruiterPrompt = (cvText) => `
You are an experienced technical recruiter and ATS analyzer.

Your task is to analyze the text content of a candidate's CV and return a structured JSON object
that captures both contact details, CV structure, and ATS-related data.

Output the result in **exactly** the following JSON format (with all keys present, even if null or empty):

{
  "detail": {
    "contact": {
      "contactInfo": {
        "email": [list of emails found],
        "phone": [list of phone numbers or null],
        "linkedin": [list of LinkedIn URLs],
        "portfolio": [list of valid personal portfolio URLs or null]
      },
      "email": true or false,
      "phone": true or false,
      "linkedin": true or false,
      "portfolio": true or false
    }
  },
  "sections": {
    "count": number of detected major CV sections,
    "hits": [list of matched section keywords found in the CV text]
  },
  "ats": {
     "field": [list of professional fields/industries inferred from the CV like "information technology", "marketing", etc.],
    "position": [list of job titles found in the Work Experience section],
    "level": [one of "Intern", "Trainee", "Junior", "Middle", "Senior", "Lead", or "None Specified" if not mentioned],
    "keywords": [list of hard skills, technologies, tools, and technical keywords in Work Experience/Work History/Skills sections/Information],
    "softSkills": [list of interpersonal and communication-related soft skills found in the CV],
    "education": [list of university or school names],
    "languages": [default to ["English"] if not listed, otherwise extract listed languages]
  }
}

---

### Rules and Guidelines

- **Only extract** information that explicitly appears in the uploaded CV text — do **not** assume or infer beyond what is written.

#### Contact Info Rules
- "email": must include “@”.
- "phone": valid international or local number patterns.
- "linkedin": must contain linkedin.com.
- "portfolio": only include **valid personal portfolio sites** or professional domains such as:
  - Personal websites (e.g., https://username.com, https://firstname.dev)
  - Portfolio or creative platforms (behance.net, dribbble.com, notion.so, github.io, etc.)
  - ❌ **Do NOT** include file-sharing or storage links like "drive.google.com, dropbox.com, onedrive.live.com", etc.

#### Section Detection
- Detect major CV sections from keywords such as:
  "summary", "objective", "about me", "profile",
  "experience", "work experience", "professional experience", "work history",
  "education", "skills", "projects", "certifications", "awards",
  "publications", "languages", "professional summary",
  "professional skills", "licenses", "references", "additional information".

#### ATS Extraction
- "field": infer professional fields/industries based on explicit mentions in the CV (e.g., "software engineering", "data science", "marketing", "finance", etc.).
- "position": extract job titles under **Work Experience** or equivalent sections.
- "level": only include one of "Intern", "Trainee", "Junior", "Middle", "Senior", or "Lead".  
  If none are explicitly found, return ["none specified"].
- "keywords": include only technical or professional skills, tools, or technologies in Work Experience/Work History/Skills sections/additional Information, etc. 
- "softSkills": include teamwork, collaboration, adaptability, problem solving, communication, leadership, creativity, etc.
- "education": extract only institution names (universities, schools, academies).
- "languages": default to ["English" unless other languages are explicitly mentioned in the CV.

---

### Output Requirements
- Return **only** the final JSON (no explanation, commentary, or markdown formatting).
- Always include all keys, even if their values are null or empty arrays.
- This includes "field" under "ats", which must always appear even if no industry or field is found (use an empty array [] in that case).
- All results should be in **lowercase** format.
- Double check if the extracted data strictly adheres to the rules above.
CV TEXT:
"""
${cvText}
"""
`.trim();

module.exports = { buildRecruiterPrompt };