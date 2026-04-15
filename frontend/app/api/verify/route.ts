import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { model, apiKey, modelName } = await request.json();

    if (!model || !apiKey) {
      return NextResponse.json({ error: 'model and apiKey are required' }, { status: 400 });
    }

    switch (model) {
      case 'openai': {
        const client = new OpenAI({ apiKey });
        // Minimal completion to verify key + model
        await client.chat.completions.create({
          model: modelName || 'gpt-4o',
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 1,
        });
        return NextResponse.json({ ok: true, message: `Connected to ${modelName || 'gpt-4o'}` });
      }

      case 'gemini': {
        const genAI = new GoogleGenerativeAI(apiKey);
        const geminiModel = genAI.getGenerativeModel({ model: modelName || 'gemini-2.0-flash' });
        await geminiModel.generateContent({ contents: [{ role: 'user', parts: [{ text: 'hi' }] }], generationConfig: { maxOutputTokens: 1 } });
        return NextResponse.json({ ok: true, message: `Connected to ${modelName || 'gemini-2.0-flash'}` });
      }

      case 'claude': {
        const client = new Anthropic({ apiKey });
        await client.messages.create({
          model: modelName || 'claude-3-7-sonnet-20250219',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'hi' }],
        });
        return NextResponse.json({ ok: true, message: `Connected to ${modelName || 'claude-3-7-sonnet-20250219'}` });
      }

      case 'groq': {
        const client = new Groq({ apiKey });
        await client.chat.completions.create({
          model: modelName || 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 1,
        });
        return NextResponse.json({ ok: true, message: `Connected to ${modelName || 'llama-3.3-70b-versatile'}` });
      }

      case 'openrouter': {
        await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: modelName || 'openai/gpt-4o',
            messages: [{ role: 'user', content: 'hi' }],
            max_tokens: 1,
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
        return NextResponse.json({ ok: true, message: `Connected to ${modelName || 'openai/gpt-4o'}` });
      }

      default:
        return NextResponse.json({ error: 'Unsupported model' }, { status: 400 });
    }
  } catch (err: unknown) {
    const error = err as Error & { status?: number; response?: { data?: { error?: { message?: string } } } };
    const status = error.status || error.response?.data?.error ? 401 : 500;
    const message =
      error.message ||
      error.response?.data?.error?.message ||
      'Connection failed';
    return NextResponse.json({ ok: false, error: message }, { status: status >= 400 && status < 600 ? status : 400 });
  }
}
