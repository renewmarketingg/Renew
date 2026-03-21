import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { createGroq } from '@ai-sdk/groq';
import cohere from 'cohere-ai';
import { API_KEYS, hasApiKey, type AIProvider } from './config';

export type { AIProvider };

export interface AIProviderConfig {
  id: AIProvider;
  name: string;
  apiKeyUrl: string;
  createProvider: () => unknown;
  hasApiKey: boolean;
}

export const PROVIDERS: AIProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    hasApiKey: hasApiKey('OPENAI'),
    createProvider: () => createOpenAI({ apiKey: API_KEYS.OPENAI }),
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    apiKeyUrl: 'https://console.anthropic.com/',
    hasApiKey: hasApiKey('ANTHROPIC'),
    createProvider: () => createAnthropic({ apiKey: API_KEYS.ANTHROPIC }),
  },
  {
    id: 'google',
    name: 'Google',
    apiKeyUrl: 'https://aistudio.google.com/app/apikey',
    hasApiKey: hasApiKey('GEMINI'),
    createProvider: () => createGoogleGenerativeAI({ apiKey: API_KEYS.GEMINI }),
  },
  {
    id: 'mistral',
    name: 'Mistral',
    apiKeyUrl: 'https://console.mistral.ai/api-keys/',
    hasApiKey: hasApiKey('MISTRAL'),
    createProvider: () => createMistral({ apiKey: API_KEYS.MISTRAL }),
  },
  {
    id: 'groq',
    name: 'Groq',
    apiKeyUrl: 'https://console.groq.com/keys',
    hasApiKey: hasApiKey('GROQ'),
    createProvider: () => createGroq({ apiKey: API_KEYS.GROQ }),
  },
  {
    id: 'cohere',
    name: 'Cohere',
    apiKeyUrl: 'https://dashboard.cohere.com/api-keys',
    hasApiKey: hasApiKey('COHERE'),
    createProvider: () => cohere,
  },
];

export const getProviderById = (id: string): AIProviderConfig | undefined => {
  return PROVIDERS.find((p) => p.id === id);
};

export const hasAnyApiKey = (): boolean => {
  return PROVIDERS.some((p) => p.hasApiKey);
};

export const getAvailableProviders = (): AIProviderConfig[] => {
  return PROVIDERS.filter((p) => p.hasApiKey);
};
