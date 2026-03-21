export const API_KEYS = {
  OPENAI: import.meta.env.OPENAI_API_KEY || '',
  ANTHROPIC: import.meta.env.ANTHROPIC_API_KEY || '',
  GEMINI: import.meta.env.GEMINI_API_KEY || '',
  MISTRAL: import.meta.env.MISTRAL_API_KEY || '',
  GROQ: import.meta.env.GROQ_API_KEY || '',
  COHERE: import.meta.env.COHERE_API_KEY || '',
} as const;

export const hasApiKey = (provider: keyof typeof API_KEYS): boolean => {
  return Boolean(API_KEYS[provider]);
};

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'mistral' | 'groq' | 'cohere';

export const getProviderForModel = (modelId: string): AIProvider => {
  if (modelId.startsWith('gpt-')) return 'openai';
  if (modelId.startsWith('claude-')) return 'anthropic';
  if (modelId.startsWith('gemini-')) return 'google';
  if (modelId.startsWith('mistral-')) return 'mistral';
  if (modelId.startsWith('llama-') || modelId.startsWith('mixtral-')) return 'groq';
  if (modelId.startsWith('command-')) return 'cohere';
  return 'openai';
};
