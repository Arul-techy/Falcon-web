import OpenAI from 'openai';
import { buildSystemPrompt, buildUserMessage } from '../utils/promptBuilder';

export async function generateWithOpenAI({ apiKey, prompt, config, modelName }: {
  apiKey: string; prompt: string; config?: { temperature?: number; maxTokens?: number }; modelName?: string;
}) {
  const client = new OpenAI({ apiKey });
  const model = modelName || 'gpt-5.4';
  const temperature = config?.temperature ?? 0.7;
  const maxTokens = config?.maxTokens ?? 4096;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: buildSystemPrompt(prompt) },
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
