const ALLOWED_MODELS = ['openai', 'gemini', 'claude', 'groq', 'openrouter'] as const;

export type ModelType = typeof ALLOWED_MODELS[number];

export interface GenerateRequestBody {
  model: string;
  apiKey: string;
  prompt: string;
  config?: {
    temperature?: number;
    maxTokens?: number;
  };
  modelName?: string;
}

/**
 * Validates the incoming generate request.
 */
export function validateRequest({ model, apiKey, prompt }: GenerateRequestBody): { valid: boolean; error?: string } {
  if (!model || !ALLOWED_MODELS.includes(model as ModelType)) {
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
