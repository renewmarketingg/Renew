export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
  timestamp?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  path?: string;
  connectedAt?: string;
}

export interface ConnectedProject {
  name: string;
  path: string;
  connectedAt: string;
}

export type AiModel = 'gpt-4' | 'gpt-4o' | 'claude' | 'gemini' | 'llama';

export interface AiQuickAction {
  prompt: string;
  icon: string;
  label: string;
}
