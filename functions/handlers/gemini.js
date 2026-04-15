const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildSystemPrompt, buildUserMessage } = require('../utils/promptBuilder');

/**
 * Generate website using Google Gemini API
 */
async function generateWithGemini({ apiKey, prompt, config, modelName }) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName || 'gemini-1.5-pro',
    systemInstruction: buildSystemPrompt(),
    generationConfig: {
      temperature: config?.temperature ?? 0.7,
      maxOutputTokens: config?.maxTokens ?? 4096,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(buildUserMessage(prompt));
  const response = result.response;
  const content = response.text();
  const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

  return { rawContent: content, tokensUsed };
}

module.exports = { generateWithGemini };
