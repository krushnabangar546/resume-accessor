export const RESUME_EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    skills: { type: 'array', items: { type: 'string' } },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          company: { type: 'string' },
          duration: { type: 'string' },
          description: { type: 'string' }
        },
        required: ['title', 'company', 'duration', 'description']
      }
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          degree: { type: 'string' },
          institution: { type: 'string' },
          year: { type: 'string' }
        },
        required: ['degree', 'institution', 'year']
      }
    },
    certifications: { type: 'array', items: { type: 'string' } },
    projects: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          technologies: { type: 'array', items: { type: 'string' } }
        },
        required: ['name', 'description', 'technologies']
      }
    }
  },
  required: ['name', 'email', 'phone', 'skills', 'experience', 'education', 'certifications', 'projects']
};

export const buildResumeExtractionPrompt = (resumeText) => `
Extract all structured information from the following resume text.

Parse every detail carefully:
- All technical and soft skills mentioned anywhere in the resume
- Each work experience with title, company name, date range (as duration string), and key responsibilities
- All educational qualifications with degree name, institution, and graduation year
- All certifications, licenses, and credentials
- All projects with their names, what they do, and technologies used

For any field not found in the resume, use an empty string or empty array.

Resume Text:
${resumeText}
`.trim();
