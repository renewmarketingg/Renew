export interface AiModelConfig {
  id: string;
  name: string;
  provider: string;
  providerId: string;
  description: string;
  icon: string;
  maxTokens?: number;
  supportsImages?: boolean;
  supportsVision?: boolean;
}

export const AI_MODELS: AiModelConfig[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerId: 'openai',
    description: 'Mais capaz, rápido e inteligente',
    icon: 'lucide:sparkles',
    maxTokens: 128000,
    supportsImages: true,
    supportsVision: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    providerId: 'openai',
    description: 'Rápido e econômico',
    icon: 'lucide:sparkles',
    maxTokens: 128000,
    supportsImages: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    providerId: 'openai',
    description: 'Alto desempenho',
    icon: 'lucide:sparkles',
    maxTokens: 128000,
    supportsVision: true,
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    providerId: 'anthropic',
    description: 'Análise profunda e código',
    icon: 'lucide:bot',
    maxTokens: 200000,
    supportsVision: true,
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    providerId: 'anthropic',
    description: 'Rápido e preciso',
    icon: 'lucide:bot',
    maxTokens: 200000,
    supportsVision: true,
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    providerId: 'anthropic',
    description: 'Modelo mais capaz',
    icon: 'lucide:bot',
    maxTokens: 200000,
    supportsVision: true,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    providerId: 'google',
    description: 'Contexto longo',
    icon: 'lucide:gem',
    maxTokens: 2000000,
    supportsVision: true,
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    providerId: 'google',
    description: 'Rápido e eficiente',
    icon: 'lucide:gem',
    maxTokens: 1000000,
    supportsVision: true,
  },
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    providerId: 'google',
    description: 'Experimental',
    icon: 'lucide:gem',
    maxTokens: 1000000,
    supportsVision: true,
  },
  {
    id: 'mistral-large-latest',
    name: 'Mistral Large',
    provider: 'Mistral',
    providerId: 'mistral',
    description: 'Alto desempenho',
    icon: 'lucide:wind',
    maxTokens: 128000,
  },
  {
    id: 'mistral-small-latest',
    name: 'Mistral Small',
    provider: 'Mistral',
    providerId: 'mistral',
    description: 'Rápido e econômico',
    icon: 'lucide:wind',
    maxTokens: 128000,
  },
  {
    id: 'mistral-nemo',
    name: 'Mistral Nemo',
    provider: 'Mistral',
    providerId: 'mistral',
    description: 'Equilibrado',
    icon: 'lucide:wind',
    maxTokens: 128000,
  },
  {
    id: 'llama-3.1-70b-versatile',
    name: 'Llama 3.1 70B',
    provider: 'Groq',
    providerId: 'groq',
    description: 'Versátil e rápido',
    icon: 'lucide:bird',
    maxTokens: 128000,
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    provider: 'Groq',
    providerId: 'groq',
    description: 'Ultra rápido',
    icon: 'lucide:bird',
    maxTokens: 128000,
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    provider: 'Groq',
    providerId: 'groq',
    description: 'Alta qualidade',
    icon: 'lucide:bird',
    maxTokens: 32768,
  },
  {
    id: 'command-r-plus',
    name: 'Command R+',
    provider: 'Cohere',
    providerId: 'cohere',
    description: 'RAG otimizado',
    icon: 'lucide:cpu',
    maxTokens: 128000,
  },
  {
    id: 'command-r',
    name: 'Command R',
    provider: 'Cohere',
    providerId: 'cohere',
    description: 'Eficiente',
    icon: 'lucide:cpu',
    maxTokens: 128000,
  },
];

export const DEFAULT_MODEL = 'gpt-4o';

export const getModelById = (id: string): AiModelConfig | undefined => {
  return AI_MODELS.find((m) => m.id === id);
};

export const getModelsByProvider = (providerId: string): AiModelConfig[] => {
  return AI_MODELS.filter((m) => m.providerId === providerId);
};

export const getProviders = (): string[] => {
  return [...new Set(AI_MODELS.map((m) => m.provider))];
};
