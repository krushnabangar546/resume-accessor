export const JOB_EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    requiredSkills: { type: 'array', items: { type: 'string' } },
    preferredSkills: { type: 'array', items: { type: 'string' } },
    experienceRequired: { type: 'string' },
    educationRequirements: { type: 'string' },
    responsibilities: { type: 'array', items: { type: 'string' } }
  },
  required: ['requiredSkills', 'preferredSkills', 'experienceRequired', 'educationRequirements', 'responsibilities']
};

export const buildJobExtractionPrompt = (jobDescription) => `
Extract structured requirements from the following job description.

Identify:
- requiredSkills: Skills explicitly marked as required, must-have, or essential
- preferredSkills: Skills marked as preferred, nice-to-have, or a plus
- experienceRequired: Summarize the required years and type of experience in one sentence
- educationRequirements: Summarize the required education level and field in one sentence
- responsibilities: List of key job duties and responsibilities

If a category has no clear information, use an empty string or empty array.

Job Description:
${jobDescription}
`.trim();
