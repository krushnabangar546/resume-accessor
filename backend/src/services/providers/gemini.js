import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIServiceError } from './base.js';

export class GeminiProvider {
  constructor() {
    this._client = null;
  }

  _getClient() {
    if (this._client) return this._client;
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'your_gemini_api_key_here') {
      throw new AIServiceError(
        'GEMINI_API_KEY not set. Get a free key at https://aistudio.google.com → Get API Key',
        'NOT_CONFIGURED'
      );
    }
    this._client = new GoogleGenerativeAI(key);
    return this._client;
  }

  async generate(schema, prompt) {
    const modelName = process.env.AI_MODEL || 'gemini-2.0-flash';
    try {
      const model = this._getClient().getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema
        }
      });
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    } catch (err) {
      if (err instanceof AIServiceError) throw err;
      const msg = err.message || '';
      if (msg.includes('API_KEY_INVALID') || msg.includes('[400]')) {
        throw new AIServiceError('Invalid Gemini API key. Check GEMINI_API_KEY in .env', 'INVALID_KEY');
      }
      if (msg.includes('429') && msg.includes('limit: 0')) {
        throw new AIServiceError(
          'Gemini free quota exhausted (limit: 0). The current API key has no remaining quota. ' +
          'Create a new key at https://aistudio.google.com or switch AI_PROVIDER in .env',
          'QUOTA_EXCEEDED'
        );
      }
      if (msg.includes('429')) {
        throw new AIServiceError('Gemini rate limit hit. Retry in a moment.', 'RATE_LIMIT');
      }
      if (msg.includes('403')) {
        throw new AIServiceError('Gemini API not enabled for this project.', 'INVALID_KEY');
      }
      throw new AIServiceError(`Gemini error: ${msg.slice(0, 300)}`, 'PROVIDER_ERROR');
    }
  }
}
