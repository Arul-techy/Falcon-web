import Groq from 'groq-sdk';
import { buildSystemPrompt, buildUserMessage } from '../utils/promptBuilder';

export async function generateWithGroq({ apiKey, prompt, config, modelName }: {
  apiKey: string; prompt: string; config?: { temperature?: number; maxTokens?: number }; modelName?: string;
}) {
  const client = new Groq({ apiKey });
  const model = modelName || 'meta-llama/llama-4-scout-17b-16e-instruct';
  const temperature = config?.temperature ?? 0.7;
  const maxTokens = config?.maxTokens ?? 4096;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserMessage(prompt) },
    ],
    temperature,
    max_tokens: maxTokens,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  const tokensUsed = response.usage?.total_tokens || 0;
  return { rawContent: content, tokensUsed };
}
