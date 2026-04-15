/**
 * Detects if user wants a single inline HTML file.
 */
function wantsInline(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  const inlineKeywords = [
    'single file', 'single html', 'one file', 'one html',
    'inline', 'all in one', 'standalone html', 'no separate',
  ];
  return inlineKeywords.some((kw) => lower.includes(kw));
}

/**
 * Builds a consistent system prompt for all AI models.
 * Automatically chooses separate-files or inline mode based on user prompt.
 */
export function buildSystemPrompt(prompt?: string): string {
  const inline = prompt ? wantsInline(prompt) : false;

  if (inline) {
    return `You are an expert full-stack web developer. Your task is to generate a complete, beautiful, and functional website as a SINGLE inline HTML file.

CRITICAL INSTRUCTIONS:
1. You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no code fences.
2. The JSON must have exactly these three keys: "html", "css", "js"
3. "html" = a SINGLE complete HTML file with ALL CSS in <style> tags and ALL JavaScript in <script> tags inlined
4. "css" = empty string ""
5. "js" = empty string ""

QUALITY REQUIREMENTS:
- Design must be modern, visually stunning, and professional
- Use rich color palettes, gradients, and smooth animations
- Make it fully responsive (mobile-first)
- Use semantic HTML5 elements
- Add meaningful interactions and hover effects
- Include Google Fonts via <link> in <head>

JSON FORMAT (respond with exactly this structure):
{"html":"<!DOCTYPE html>...","css":"","js":""}

DO NOT include any text outside the JSON object.`;
  }

  return `You are an expert full-stack web developer. Your task is to generate a complete, beautiful, and functional website with SEPARATE files for HTML, CSS, and JavaScript.

CRITICAL INSTRUCTIONS:
1. You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no code fences.
2. The JSON must have exactly these three keys: "html", "css", "js"
3. "html" = complete index.html file with <link rel="stylesheet" href="styles.css"> in <head> and <script src="script.js"></script> before </body>
4. "css" = complete styles.css file with ALL styling (do NOT put any <style> tags inside the html)
5. "js" = complete script.js file with ALL JavaScript (do NOT put any <script> blocks inside the html). Can be empty string if no JS needed.

IMPORTANT: Keep CSS and JS COMPLETELY separate from the HTML file. The HTML should only contain structural markup, with stylesheet and script references.

QUALITY REQUIREMENTS:
- Design must be modern, visually stunning, and professional
- Use rich color palettes, gradients, and smooth animations
- Make it fully responsive (mobile-first)
- Use semantic HTML5 elements
- Add meaningful interactions and hover effects
- Include Google Fonts via <link> in <head>
- CSS should use custom properties (variables) for theming
- Ensure cross-browser compatibility

JSON FORMAT (respond with exactly this structure):
{"html":"<!DOCTYPE html>...","css":"body { ... }","js":"// js code"}

DO NOT include any text outside the JSON object.`;
}

/**
 * Builds the user message to send to the AI.
 */
export function buildUserMessage(prompt: string): string {
  const inline = wantsInline(prompt);
  const modeHint = inline
    ? 'Generate everything as a SINGLE inline HTML file (all CSS in <style>, all JS in <script>). Set css and js to empty strings in the JSON.'
    : 'Generate SEPARATE files: html (with <link> to styles.css and <script src="script.js">), css (full stylesheet), js (full script).';

  return `Create a website with the following description:

${prompt}

${modeHint}

Remember: Respond ONLY with the JSON object containing html, css, and js keys.`;
}
