import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { createGroq } from '@ai-sdk/groq';
import { DEFAULT_MODEL } from './models';
import { API_KEYS, getProviderForModel } from './config';

export interface SendMessageOptions {
  messages: { role: 'user' | 'assistant'; content: string }[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  systemPrompt?: string;
}

export const sendMessage = async (options: SendMessageOptions): Promise<string> => {
  const {
    messages,
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 4096,
    topP = 1.0,
    presencePenalty = 0.0,
    frequencyPenalty = 0.0,
    systemPrompt = 'You are a helpful AI Assistant. Respond in Portuguese (Brazil).',
  } = options;

  const provider = getProviderForModel(model);
  const systemMsg = { role: 'system' as const, content: systemPrompt };
  const allMessages = [
    systemMsg,
    ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
  ];

  try {
    switch (provider) {
      case 'openai': {
        const openai = createOpenAI({ apiKey: API_KEYS.OPENAI });
        const result = await generateText({
          model: openai(model),
          messages: allMessages,
          temperature,
          maxOutputTokens: maxTokens,
          topP,
          presencePenalty,
          frequencyPenalty,
        });
        return result.text;
      }
      case 'anthropic': {
        const anthropic = createAnthropic({ apiKey: API_KEYS.ANTHROPIC });
        const result = await generateText({
          model: anthropic(model),
          messages: allMessages,
          temperature,
          maxOutputTokens: maxTokens,
        });
        return result.text;
      }
      case 'google': {
        const google = createGoogleGenerativeAI({ apiKey: API_KEYS.GEMINI });
        const result = await generateText({
          model: google(model),
          messages: allMessages,
          temperature,
          maxOutputTokens: maxTokens,
        });
        return result.text;
      }
      case 'mistral': {
        const mistral = createMistral({ apiKey: API_KEYS.MISTRAL });
        const result = await generateText({
          model: mistral(model),
          messages: allMessages,
          temperature,
          maxOutputTokens: maxTokens,
        });
        return result.text;
      }
      case 'groq': {
        const groq = createGroq({ apiKey: API_KEYS.GROQ });
        const result = await generateText({
          model: groq(model),
          messages: allMessages,
          temperature,
          maxOutputTokens: maxTokens,
        });
        return result.text;
      }
      default: {
        const openai = createOpenAI({ apiKey: API_KEYS.OPENAI });
        const result = await generateText({
          model: openai(model),
          messages: allMessages,
          temperature,
          maxOutputTokens: maxTokens,
        });
        return result.text;
      }
    }
  } catch (error) {
    console.error('AI Chat Error:', error);
    throw error;
  }
};

export const generateImage = async (_prompt: string): Promise<string> => {
  return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23841ae3" width="400" height="400"/><text x="50%" y="50%" fill="white" font-family="Arial" font-size="20" text-anchor="middle" dy=".3em">Image Generation Coming Soon</text></svg>';
};
