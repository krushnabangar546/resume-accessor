export class AIServiceError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
    // RATE_LIMIT errors are worth retrying; others need user action
    this.retryable = code === 'RATE_LIMIT';
  }
}

// Error codes:
// NOT_CONFIGURED  — API key missing or provider not set up
// INVALID_KEY     — provider rejected the key (bad format / revoked)
// QUOTA_EXCEEDED  — billing limit or daily free quota exhausted
// RATE_LIMIT      — too many requests per minute (transient, retryable)
// PROVIDER_ERROR  — unexpected error from the provider API
