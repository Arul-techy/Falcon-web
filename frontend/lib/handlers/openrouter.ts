import axios from 'axios';
import { buildSystemPrompt, buildUserMessage } from '../utils/promptBuilder';

export async function generateWithOpenRouter({ apiKey, prompt, config, modelName }: {
  apiKey: string; prompt: string; config?: { temperature?: number; maxTokens?: number }; modelName?: string;
}) {
  const model = modelName || 'openai/gpt-4o';
  const temperature = config?.temperature ?? 0.7;
  const maxTokens = config?.maxTokens ?? 4096;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserMessage(prompt) },
      ],
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://falcon-web-builder.app',
        'X-Title': 'Falcon Web-Builder',
      },
    }
  );

  const content = response.data.choices[0]?.message?.content || '{}';
  const tokensUsed = response.data.usage?.total_tokens || 0;
  return { rawContent: content, tokensUsed };
}
