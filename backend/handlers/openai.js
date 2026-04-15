const OpenAI = require('openai');
const { buildSystemPrompt, buildUserMessage } = require('../utils/promptBuilder');

/**
 * Generate website using OpenAI API
 */
async function generateWithOpenAI({ apiKey, prompt, config, modelName }) {
  const client = new OpenAI({ apiKey });

  const model = modelName || 'gpt-4o';
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

module.exports = { generateWithOpenAI };
