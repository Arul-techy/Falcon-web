const express = require('express');
const router = express.Router();
const { validateRequest } = require('../utils/validate');
const { generateWithOpenAI } = require('../handlers/openai');
const { generateWithGemini } = require('../handlers/gemini');
const { generateWithClaude } = require('../handlers/claude');
const { generateWithGroq } = require('../handlers/groq');
const { generateWithOpenRouter } = require('../handlers/openrouter');

/**
 * Robustly parse AI response to extract {html, css, js}
 */
function parseAIResponse(rawContent) {
  try {
    // Try direct JSON parse
    const parsed = JSON.parse(rawContent);
    if (parsed.html !== undefined) return parsed;
  } catch (_) {}

  // Try to extract JSON from markdown code blocks
  const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.html !== undefined) return parsed;
    } catch (_) {}
  }

  // Try to find raw JSON object in the string
  const objMatch = rawContent.match(/\{[\s\S]*"html"[\s\S]*\}/);
  if (objMatch) {
    try {
      const parsed = JSON.parse(objMatch[0]);
      if (parsed.html !== undefined) return parsed;
    } catch (_) {}
  }

  // Fallback: return the raw content as HTML
  return {
    html: `<!DOCTYPE html><html><head><title>Generated Site</title></head><body>${rawContent}</body></html>`,
    css: '',
    js: '',
  };
}

/**
 * POST /api/generate
 * Body: { model, apiKey, prompt, config, modelName }
 */
router.post('/generate', async (req, res) => {
  const { model, apiKey, prompt, config, modelName } = req.body;

  // Validate
  const validation = validateRequest({ model, apiKey, prompt, config });
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    let result;

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
        return res.status(400).json({ error: 'Unsupported model' });
    }

    const parsed = parseAIResponse(result.rawContent);

    res.json({
      html: parsed.html || '',
      css: parsed.css || '',
      js: parsed.js || '',
      tokensUsed: result.tokensUsed,
    });
  } catch (err) {
    console.error(`[generate] Error with model ${model}:`, err.message);

    // Surface useful error messages
    const status = err.status || err.response?.status || 500;
    const message =
      err.message ||
      err.response?.data?.error?.message ||
      'An error occurred while generating the website';

    res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
  }
});

module.exports = router;
