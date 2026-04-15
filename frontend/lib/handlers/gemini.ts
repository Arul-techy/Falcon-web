import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt, buildUserMessage } from '../utils/promptBuilder';

export async function generateWithGemini({ apiKey, prompt, config, modelName }: {
  apiKey: string; prompt: string; config?: { temperature?: number; maxTokens?: number }; modelName?: string;
}) {
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
