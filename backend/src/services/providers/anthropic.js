import { AIServiceError } from './base.js';

export class AnthropicProvider {
  constructor() {
    this._client = null;
  }

  async _getClient() {
    if (this._client) return this._client;
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key || key === 'your_anthropic_api_key_here') {
      throw new AIServiceError(
        'ANTHROPIC_API_KEY not set. Get a key at https://console.anthropic.com',
        'NOT_CONFIGURED'
      );
    }
    try {
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      this._client = new Anthropic({ apiKey: key });
    } catch {
      throw new AIServiceError(
        'Anthropic SDK not installed. Run: npm install @anthropic-ai/sdk',
        'NOT_CONFIGURED'
      );
    }
    return this._client;
  }

  async generate(schema, prompt) {
    const client = await this._getClient();
    const model = process.env.AI_MODEL || 'claude-opus-4-8';
    try {
      const stream = client.messages.stream({
        model,
        max_tokens: 4096,
        thinking: { type: 'adaptive' },
        output_config: { format: { type: 'json_schema', schema } },
        messages: [{ role: 'user', content: prompt }]
      });
      const response = await stream.finalMessage();
      const textBlock = response.content.find((b) => b.type === 'text');
      if (!textBlock) throw new Error('No text block in response');
      return JSON.parse(textBlock.text);
    } catch (err) {
      if (err instanceof AIServiceError) throw err;
      const msg = err.message || '';
      if (msg.includes('401') || msg.includes('authentication')) {
        throw new AIServiceError('Invalid Anthropic API key', 'INVALID_KEY');
      }
      if (msg.includes('429') || msg.includes('rate_limit')) {
        throw new AIServiceError('Anthropic rate limit hit', 'RATE_LIMIT');
      }
      throw new AIServiceError(`Anthropic error: ${msg.slice(0, 300)}`, 'PROVIDER_ERROR');
    }
  }
}
