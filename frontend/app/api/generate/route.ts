import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/utils/validate';
import { generateWithOpenAI } from '@/lib/handlers/openai';
import { generateWithGemini } from '@/lib/handlers/gemini';
import { generateWithClaude } from '@/lib/handlers/claude';
import { generateWithGroq } from '@/lib/handlers/groq';
import { generateWithOpenRouter } from '@/lib/handlers/openrouter';

/**
 * Robustly parse AI response to extract {html, css, js}
 */
function parseAIResponse(rawContent: string) {
  try {
    const parsed = JSON.parse(rawContent);
    if (parsed.html !== undefined) return parsed;
  } catch {}

  const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.html !== undefined) return parsed;
    } catch {}
  }

  const objMatch = rawContent.match(/\{[\s\S]*"html"[\s\S]*\}/);
  if (objMatch) {
    try {
      const parsed = JSON.parse(objMatch[0]);
      if (parsed.html !== undefined) return parsed;
    } catch {}
  }

  return {
    html: `<!DOCTYPE html><html><head><title>Generated Site</title></head><body>${rawContent}</body></html>`,
    css: '',
    js: '',
  };
}

export async function POST(request: NextRequest) {
  try {
    const { model, apiKey, prompt, config, modelName } = await request.json();

    const validation = validateRequest({ model, apiKey, prompt, config });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    let result: { rawContent: string; tokensUsed: number };

    switch (model) {
      case 'openai':
        result = await generateWithOpenAI({ apiKey, prompt, config, modelName });
        break;
      case 'gemini':
        result = await generateWithGemini({ apiKey, prompt, config, modelName });
        break;
      case 'claude':
        result = await generateWithClaude({ apiKey, prompt, config, modelName });
        break;
      case 'groq':
        result = await generateWithGroq({ apiKey, prompt, config, modelName });
        break;
      case 'openrouter':
        result = await generateWithOpenRouter({ apiKey, prompt, config, modelName });
        break;
      default:
        return NextResponse.json({ error: 'Unsupported model' }, { status: 400 });
    }

    const parsed = parseAIResponse(result.rawContent);

    return NextResponse.json({
      html: parsed.html || '',
      css: parsed.css || '',
      js: parsed.js || '',
      tokensUsed: result.tokensUsed,
    });
  } catch (err: unknown) {
    const error = err as Error & { status?: number; response?: { status?: number; data?: { error?: { message?: string } } } };
    console.error(`[generate] Error:`, error.message);

    const status = error.status || error.response?.status || 500;
    const message = error.message || error.response?.data?.error?.message || 'An error occurred while generating the website';

    return NextResponse.json(
      { error: message },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
