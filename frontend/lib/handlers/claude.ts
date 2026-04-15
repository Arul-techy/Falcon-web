import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, buildUserMessage } from '../utils/promptBuilder';

export async function generateWithClaude({ apiKey, prompt, config, modelName }: {
  apiKey: string; prompt: string; config?: { temperature?: number; maxTokens?: number }; modelName?: string;
}) {
  const client = new Anthropic({ apiKey });
  const model = modelName || 'claude-sonnet-4-6';
  const maxTokens = config?.maxTokens ?? 4096;
  const temperature = config?.temperature ?? 0.7;

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: buildSystemPrompt(prompt),
    messages: [
      { role: 'user', content: buildUserMessage(prompt) },
    ],
    temperature,
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  const content = textBlock && 'text' in textBlock ? textBlock.text : '{}';
  const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);
  return { rawContent: content, tokensUsed };
}
