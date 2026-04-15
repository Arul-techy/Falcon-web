export interface GenerateConfig {
  temperature: number;
  maxTokens: number;
}

export interface GenerateRequest {
  model: string;
  apiKey: string;
  prompt: string;
  config: GenerateConfig;
  modelName?: string;
}

export interface GenerateResponse {
  html: string;
  css: string;
  js: string;
  tokensUsed: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

/**
 * Call the backend API to generate a website
 * API keys are sent in the request body and never stored
 */
export async function generateWebsite(request: GenerateRequest): Promise<GenerateResponse> {
  const response = await fetch(`${BACKEND_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: request.model,
      apiKey: request.apiKey,
      prompt: request.prompt,
      config: request.config,
      modelName: request.modelName,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  return response.json();
}
