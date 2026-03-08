import type { Chat } from './storage';
import { generateId, getChats, saveChats, setCurrentChatId } from './storage';

let currentChatId: string | null = null;

export const getCurrentChatIdLocal = (): string | null => {
  return currentChatId;
};

export const setCurrentChatIdLocal = (id: string): void => {
  currentChatId = id;
};

export const createNewChat = (): Chat => {
  const chats = getChats();
  const newChat: Chat = {
    id: generateId(),
    title: 'Nova conversa',
    messages: [],
    model: 'gpt-4o',
    createdAt: new Date().toISOString(),
  };

  chats.unshift(newChat);
  saveChats(chats);
  setCurrentChatId(newChat.id);
  currentChatId = newChat.id;

  return newChat;
};

export const renameChat = (chatId: string, newTitle: string): void => {
  const chats = getChats();
  const chatIndex = chats.findIndex((c) => c.id === chatId);
  if (chatIndex !== -1) {
    chats[chatIndex].title = newTitle;
    saveChats(chats);
  }
};

export const deleteChat = (chatId: string): void => {
  const chats = getChats();
  const filtered = chats.filter((c) => c.id !== chatId);
  saveChats(filtered);

  if (currentChatId === chatId) {
    if (filtered.length > 0) {
      loadChat(filtered[0].id);
    } else {
      const newChat = createNewChat();
      currentChatId = newChat.id;
    }
  }
};

export const loadChat = (chatId: string): Chat | null => {
  setCurrentChatId(chatId);
  currentChatId = chatId;

  const chats = getChats();
  return chats.find((c) => c.id === chatId) ?? null;
};

export const addMessageToChat = (
  role: 'user' | 'assistant',
  content: string,
  images: string[] = []
): void => {
  const chats = getChats();
  const chatIndex = chats.findIndex((c) => c.id === currentChatId);
  if (chatIndex === -1) return;

  const message = { role, content, images, timestamp: new Date().toISOString() };
  chats[chatIndex].messages.push(message);

  if (role === 'user' && chats[chatIndex].title === 'Nova conversa') {
    const preview = content.substring(0, 30) + (content.length > 30 ? '...' : '');
    chats[chatIndex].title = preview || 'Nova conversa';
  }

  saveChats(chats);
};

export const clearCurrentChat = (): void => {
  const chats = getChats();
  const chatIndex = chats.findIndex((c) => c.id === currentChatId);
  if (chatIndex !== -1) {
    chats[chatIndex].messages = [];
    chats[chatIndex].title = 'Nova conversa';
    saveChats(chats);
  }
};

export const updateChatModel = (model: string): void => {
  if (!currentChatId) return;

  const chats = getChats();
  const chatIndex = chats.findIndex((c) => c.id === currentChatId);
  if (chatIndex !== -1) {
    chats[chatIndex].model = model;
    saveChats(chats);
  }
};

export const getAllChats = (): Chat[] => {
  return getChats();
};
