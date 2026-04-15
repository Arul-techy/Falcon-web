/**
 * Builds a consistent system prompt for all AI models.
 * Instructs the AI to return ONLY a JSON object with html, css, js keys.
 */
function buildSystemPrompt() {
  return `You are an expert full-stack web developer. Your task is to generate a complete, beautiful, and functional website based on the user's description.

CRITICAL INSTRUCTIONS:
1. You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no code fences.
2. The JSON must have exactly these three keys: "html", "css", "js"
3. "html" = complete index.html (include <!DOCTYPE html>, <head>, <body>, link to styles.css, script.js)
4. "css" = complete styles.css content
5. "js" = complete script.js content (can be empty string if no JS needed)

QUALITY REQUIREMENTS:
- Design must be modern, visually stunning, and professional
- Use rich color palettes, gradients, and smooth animations
- Make it fully responsive (mobile-first)
- Use semantic HTML5 elements
- Add meaningful interactions and hover effects
- Ensure cross-browser compatibility

JSON FORMAT (respond with exactly this structure):
{"html":"<!DOCTYPE html>...","css":"body { ... }","js":"// js code"}

DO NOT include any text outside the JSON object.`;
}

/**
 * Builds the user message to send to the AI.
 */
function buildUserMessage(prompt) {
  return `Create a website with the following description:\n\n${prompt}\n\nRemember: Respond ONLY with the JSON object containing html, css, and js keys.`;
}

module.exports = { buildSystemPrompt, buildUserMessage };
