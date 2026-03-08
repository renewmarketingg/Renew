import type { Chat, ChatMessage, Project, ConnectedProject } from '@/types/ai';

export type { ChatMessage, Chat, Project, ConnectedProject };
export type ToastType = 'success' | 'error' | 'info';

const STORAGE_KEYS = {
  CHATS: 'ai_chats',
  CURRENT_CHAT: 'ai_current_chat',
  PROJECTS: 'ai_projects',
  CONNECTED_PROJECT: 'ai_connected_project',
} as const;

export const generateId = (): string => {
  return `${Date.now().toString(36)}${Math.random().toString(36).substring(2)}`;
};

export const getChats = (): Chat[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CHATS);
  return stored ? JSON.parse(stored) : [];
};

export const saveChats = (chats: Chat[]): void => {
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
};

export const getCurrentChatId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT);
};

export const setCurrentChatId = (id: string): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT, id);
};

export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return stored ? JSON.parse(stored) : [];
};

export const saveProjects = (projects: Project[]): void => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const getConnectedProject = (): ConnectedProject | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.CONNECTED_PROJECT);
  return stored ? JSON.parse(stored) : null;
};

export const setConnectedProject = (project: ConnectedProject): void => {
  localStorage.setItem(STORAGE_KEYS.CONNECTED_PROJECT, JSON.stringify(project));
};

export const clearConnectedProject = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CONNECTED_PROJECT);
};
