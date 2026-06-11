import { AIServiceError } from './base.js';

// Extracts JSON from raw text — handles markdown code blocks and bare JSON
const extractJSON = (text) => {
  const inBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return JSON.parse(inBlock ? inBlock[1] : text.trim());
};

// Handles both OpenAI (api.openai.com) and OpenRouter (openrouter.ai)
// OpenRouter gives access to many free models (Llama, Gemma, Mistral, etc.)
export class OpenAICompatibleProvider {
  constructor(providerName) {
    this.providerName = providerName;
    this.baseURL =
      providerName === 'openrouter'
        ? 'https://openrouter.ai/api/v1'
        : 'https://api.openai.com/v1';
  }

  _getKey() {
    const envVar = this.providerName === 'openrouter' ? 'OPENROUTER_API_KEY' : 'OPENAI_API_KEY';
    const key = process.env[envVar];
    if (!key || key.startsWith('your_')) {
      throw new AIServiceError(
        `${envVar} not set in .env. ` +
          (this.providerName === 'openrouter'
            ? 'Get a free key at https://openrouter.ai'
            : 'Get a key at https://platform.openai.com'),
        'NOT_CONFIGURED'
      );
    }
    return key;
  }

  _getModel() {
    if (process.env.AI_MODEL) return process.env.AI_MODEL;
    return this.providerName === 'openrouter'
      ? 'qwen/qwen3-8b:free'
      : 'gpt-4o-mini';
  }

  async generate(schema, prompt) {
    const key = this._getKey();
    const model = this._getModel();

    // Embed schema in prompt — broadest compatibility across providers
    const fullPrompt =
      `${prompt}\n\nRespond with ONLY valid JSON (no markdown, no explanation) matching this schema:\n` +
      JSON.stringify(schema, null, 2);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    };
    if (this.providerName === 'openrouter') {
      headers['HTTP-Referer'] = 'https://resume-accessor.local';
      headers['X-Title'] = 'Resume Accessor';
    }

    let res;
    try {
      res = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: fullPrompt }],
          temperature: 0.1
        })
      });
    } catch (networkErr) {
      throw new AIServiceError(`Network error reaching ${this.providerName}: ${networkErr.message}`, 'PROVIDER_ERROR');
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error?.message || res.statusText;
      if (res.status === 401) throw new AIServiceError(`Invalid API key: ${msg}`, 'INVALID_KEY');
      if (res.status === 402) throw new AIServiceError(`Quota/billing issue: ${msg}`, 'QUOTA_EXCEEDED');
      if (res.status === 429) throw new AIServiceError(`Rate limit exceeded: ${msg}`, 'RATE_LIMIT');
      throw new AIServiceError(`${this.providerName} error (${res.status}): ${msg}`, 'PROVIDER_ERROR');
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    try {
      return extractJSON(text);
    } catch {
      throw new AIServiceError(
        `${this.providerName} returned invalid JSON: ${text.slice(0, 200)}`,
        'PROVIDER_ERROR'
      );
    }
  }
}
