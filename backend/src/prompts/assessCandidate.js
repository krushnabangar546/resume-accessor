export const ASSESSMENT_SCHEMA = {
  type: 'object',
  properties: {
    technicalSkills: {
      type: 'object',
      properties: {
        score: { type: 'integer' },
        reason: { type: 'string' }
      },
      required: ['score', 'reason']
    },
    experience: {
      type: 'object',
      properties: {
        score: { type: 'integer' },
        reason: { type: 'string' }
      },
      required: ['score', 'reason']
    },
    education: {
      type: 'object',
      properties: {
        score: { type: 'integer' },
        reason: { type: 'string' }
      },
      required: ['score', 'reason']
    },
    projectRelevance: {
      type: 'object',
      properties: {
        score: { type: 'integer' },
        reason: { type: 'string' }
      },
      required: ['score', 'reason']
    },
    certificationRelevance: {
      type: 'object',
      properties: {
        score: { type: 'integer' },
        reason: { type: 'string' }
      },
      required: ['score', 'reason']
    },
    overallScore: { type: 'integer' },
    strengths: { type: 'array', items: { type: 'string' } },
    missingSkills: { type: 'array', items: { type: 'string' } },
    improvementSuggestions: { type: 'array', items: { type: 'string' } }
  },
  required: [
    'technicalSkills', 'experience', 'education',
    'projectRelevance', 'certificationRelevance',
    'overallScore', 'strengths', 'missingSkills', 'improvementSuggestions'
  ]
};

export const buildAssessmentPrompt = (candidate, job) => `
You are an expert technical recruiter with 15 years of experience evaluating candidates for software engineering roles.

Evaluate the following candidate against the job requirements with nuanced, fair, and detailed assessment.

=== CANDIDATE PROFILE ===
Name: ${candidate.name}
Skills: ${candidate.skills.join(', ')}

Work Experience:
${candidate.experience.map(e => `- ${e.title} at ${e.company} (${e.duration}): ${e.description}`).join('\n')}

Education:
${candidate.education.map(e => `- ${e.degree} from ${e.institution} (${e.year})`).join('\n')}

Certifications: ${candidate.certifications.join(', ') || 'None listed'}

Projects:
${candidate.projects.map(p => `- ${p.name}: ${p.description} [Tech: ${p.technologies.join(', ')}]`).join('\n')}

=== JOB: ${job.title} at ${job.company} ===
Required Skills: ${job.requirements.requiredSkills.join(', ')}
Preferred Skills: ${job.requirements.preferredSkills.join(', ')}
Experience Required: ${job.requirements.experienceRequired}
Education Requirements: ${job.requirements.educationRequirements}
Key Responsibilities: ${job.requirements.responsibilities.join('; ')}

=== SCORING INSTRUCTIONS ===
Score each dimension from 0-100:
- technicalSkills: Match between candidate's skills and required/preferred skills. Consider semantic equivalence (e.g., "React" covers "ReactJS"). Be generous for adjacent skills.
- experience: Relevance and seniority of work history to this role's requirements.
- education: How well the candidate's education aligns with requirements. Consider equivalent experience.
- projectRelevance: How much the candidate's projects demonstrate relevant domain knowledge and technical depth.
- certificationRelevance: Value of certifications for this specific role (0 if no relevant certs, not a penalty).
- overallScore: Weighted average — weight technicalSkills 35%, experience 30%, education 15%, projectRelevance 15%, certificationRelevance 5%.

Provide specific, actionable content for:
- strengths: 3-5 concrete strengths this candidate brings to this specific role
- missingSkills: Specific technical or domain skills the candidate lacks relative to job requirements
- improvementSuggestions: Actionable steps the candidate can take to close the gaps (courses, projects, etc.)
`.trim();
