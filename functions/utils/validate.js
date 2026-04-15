const ALLOWED_MODELS = ['openai', 'gemini', 'claude', 'groq', 'openrouter'];

/**
 * Validates the incoming generate request.
 * Returns { valid: true } or { valid: false, error: string }
 */
function validateRequest({ model, apiKey, prompt, config }) {
  if (!model || !ALLOWED_MODELS.includes(model)) {
    return { valid: false, error: `Invalid model. Must be one of: ${ALLOWED_MODELS.join(', ')}` };
  }

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
    return { valid: false, error: 'A valid API key is required.' };
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
    return { valid: false, error: 'Prompt must be at least 5 characters.' };
  }

  if (prompt.length > 4000) {
    return { valid: false, error: 'Prompt must be under 4000 characters.' };
  }

  return { valid: true };
}

module.exports = { validateRequest, ALLOWED_MODELS };
