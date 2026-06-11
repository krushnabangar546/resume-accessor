import { GeminiProvider } from './providers/gemini.js';
import { OpenAICompatibleProvider } from './providers/openai.js';
import { AnthropicProvider } from './providers/anthropic.js';
import { AIServiceError } from './providers/base.js';
import { RESUME_EXTRACTION_SCHEMA, buildResumeExtractionPrompt } from '../prompts/extractResume.js';
import { JOB_EXTRACTION_SCHEMA, buildJobExtractionPrompt } from '../prompts/extractJob.js';
import { ASSESSMENT_SCHEMA, buildAssessmentPrompt } from '../prompts/assessCandidate.js';

export { AIServiceError };

// Provider is selected once per process from AI_PROVIDER env var.
// Changing it requires a server restart.
let _provider = null;

export const getProvider = () => {
  if (_provider) return _provider;

  const name = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  switch (name) {
    case 'gemini':
      _provider = new GeminiProvider();
      break;
    case 'openai':
      _provider = new OpenAICompatibleProvider('openai');
      break;
    case 'openrouter':
      _provider = new OpenAICompatibleProvider('openrouter');
      break;
    case 'anthropic':
      _provider = new AnthropicProvider();
      break;
    default:
      throw new AIServiceError(
        `Unknown AI_PROVIDER "${name}". Valid values: gemini | openai | openrouter | anthropic`,
        'NOT_CONFIGURED'
      );
  }

  console.log(`[aiService] Provider: ${name}, Model: ${process.env.AI_MODEL || '(default)'}`);
  return _provider;
};

export const extractResumeData = async (rawText) => {
  console.log('[aiService] Extracting resume data...');
  const result = await getProvider().generate(RESUME_EXTRACTION_SCHEMA, buildResumeExtractionPrompt(rawText));
  console.log(`[aiService] Resume extracted — name="${result.name}", skills=${result.skills?.length}`);
  return result;
};

export const extractJobRequirements = async (description) => {
  console.log('[aiService] Extracting job requirements...');
  const result = await getProvider().generate(JOB_EXTRACTION_SCHEMA, buildJobExtractionPrompt(description));
  console.log(`[aiService] Job requirements extracted — ${result.requiredSkills?.length} required skills`);
  return result;
};

export const assessCandidateForJob = async (candidate, job) => {
  console.log(`[aiService] Assessing "${candidate.name}" for "${job.title}"...`);
  const result = await getProvider().generate(ASSESSMENT_SCHEMA, buildAssessmentPrompt(candidate, job));
  console.log(`[aiService] Assessment done — overall=${result.overallScore}`);
  return result;
};

export const getProviderInfo = () => {
  const name = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const defaultModels = { gemini: 'gemini-2.0-flash', openai: 'gpt-4o-mini', openrouter: 'meta-llama/llama-3.1-8b-instruct:free', anthropic: 'claude-opus-4-8' };
  return { provider: name, model: process.env.AI_MODEL || defaultModels[name] || 'unknown' };
};
