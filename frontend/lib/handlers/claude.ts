import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, buildUserMessage } from '../utils/promptBuilder';

export async function generateWithClaude({ apiKey, prompt, config, modelName }: {
  apiKey: string; prompt: string; config?: { temperature?: number; maxTokens?: number }; modelName?: string;
}) {
  const client = new Anthropic({ apiKey });
  const model = modelName || 'claude-3-7-sonnet-20250219';
  const maxTokens = config?.maxTokens ?? 4096;
  const temperature = config?.temperature ?? 0.7;

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: buildSystemPrompt(),
    messages: [{ role: 'user', content: buildUserMessage(prompt) }],
  });

  const content = response.content[0]?.type === 'text' ? response.content[0].text : '{}';
  const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);
  return { rawContent: content, tokensUsed };
}
