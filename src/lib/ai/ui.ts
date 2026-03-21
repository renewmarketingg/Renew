import { getAllChats, getCurrentChatIdLocal } from './chat';
import type { ChatMessage } from './storage';
import type { ToastType } from '@/types/toast';

const getToastEl = () => {
  return document.getElementById('toast');
};

export const showToast = (message: string, type: ToastType = 'info'): void => {
  const toast = getToastEl();
  if (!toast) return;

  const msgEl = toast.querySelector('.toast-message');
  if (msgEl) msgEl.textContent = message;

  const icons: Record<ToastType, string> = { success: '✓', error: '✕', info: 'ℹ' };
  const iconEl = toast.querySelector('.toast-icon');
  if (iconEl) iconEl.textContent = icons[type];

  toast.dataset.type = type;
  toast.classList.add('show');

  clearTimeout((toast as HTMLElement & { _timer?: ReturnType<typeof setTimeout> })._timer);
  (toast as HTMLElement & { _timer?: ReturnType<typeof setTimeout> })._timer = setTimeout(
    () => toast.classList.remove('show'),
    3000
  );
};

export const $ = (selector: string): HTMLElement | null => {
  return document.querySelector(selector);
};

export const $$ = (selector: string): NodeListOf<Element> => {
  return document.querySelectorAll(selector);
};

const cloneTemplate = (id: string): DocumentFragment => {
  const tpl = document.getElementById(id) as HTMLTemplateElement | null;
  if (!tpl) return document.createDocumentFragment();
  return tpl.content.cloneNode(true) as DocumentFragment;
};

export const toggleElement = (id: string, show: boolean): void => {
  const el = $(`#${id}`);
  if (el) el.style.display = show ? 'flex' : 'none';
};

export const hideElement = (id: string): void => {
  toggleElement(id, false);
};

export const showElement = (id: string): void => {
  toggleElement(id, true);
};

export const renderChatList = (): void => {
  const chatList = $('#chatList');
  if (!chatList) return;

  const chats = getAllChats();
  const currentId = getCurrentChatIdLocal();

  chatList.querySelectorAll('.ai-chat-item').forEach((item) => item.remove());

  chats.forEach((chat) => {
    const frag = cloneTemplate('tpl-chat-item');
    const item = frag.querySelector('.ai-chat-item') as HTMLButtonElement | null;
    if (!item) return;

    if (chat.id === currentId) item.classList.add('active');
    item.dataset.chatId = chat.id;

    const titleSpan = item.querySelector('.chat-title') as HTMLElement | null;
    if (titleSpan) {
      titleSpan.textContent = chat.title;
      titleSpan.contentEditable = 'false';
    }

    item.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).contentEditable === 'true') return;
      import('./chat').then(({ loadChat }) => {
        const c = loadChat(chat.id);
        if (c) {
          renderMessages(c.messages);
          renderChatList();
        }
      });
    });

    item.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const span = item.querySelector('.chat-title') as HTMLElement;
      span.contentEditable = 'true';
      span.focus();
      span.style.cursor = 'text';
      const range = document.createRange();
      range.selectNodeContents(span);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const span = item.querySelector('.chat-title') as HTMLElement;
        span.contentEditable = 'false';
        span.blur();
        import('./chat').then(({ renameChat }) =>
          renameChat(chat.id, span.textContent || 'Nova conversa')
        );
      }
      if (e.key === 'Escape') {
        const span = item.querySelector('.chat-title') as HTMLElement;
        span.contentEditable = 'false';
        span.textContent = chat.title;
      }
    });

    item.addEventListener('blur', () => {
      const span = item.querySelector('.chat-title') as HTMLElement;
      span.contentEditable = 'false';
      import('./chat').then(({ renameChat }) =>
        renameChat(chat.id, span.textContent || 'Nova conversa')
      );
    });

    const deleteBtn = item.querySelector('.chat-delete-btn');
    deleteBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      import('./chat').then(({ deleteChat }) => {
        deleteChat(chat.id);
        renderChatList();
        showToast('Conversa excluída', 'success');
      });
    });

    chatList.appendChild(frag);
  });
};

export const renderMessages = (messages: ChatMessage[]): void => {
  const container = $('#messagesContainer');
  if (!container) return;

  container.innerHTML = '';

  if (messages.length === 0) {
    showElement('welcomeScreen');
    return;
  }

  hideElement('welcomeScreen');
  messages.forEach((msg) => addMessageToUI(msg.role, msg.content, msg.images));
};

export const addMessageToUI = (
  role: 'user' | 'assistant',
  content: string,
  images: string[] = []
): void => {
  const container = $('#messagesContainer');
  if (!container) return;

  hideElement('welcomeScreen');

  const templateId = role === 'user' ? 'tpl-message-user' : 'tpl-message-assistant';
  const frag = cloneTemplate(templateId);

  const textEl = frag.querySelector('.ai-message-text');
  if (textEl) textEl.textContent = content;

  if (images.length > 0) {
    const imagesContainer = frag.querySelector('.ai-message-images');
    if (imagesContainer) {
      images.forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Imagem anexada';
        imagesContainer.appendChild(img);
      });
      imagesContainer.removeAttribute('hidden');
    }
  }

  container.appendChild(frag);
  container.scrollTop = container.scrollHeight;
};

export const showWelcome = (): void => {
  showElement('welcomeScreen');
  const container = $('#messagesContainer');
  if (container) container.innerHTML = '';
};

export const showTypingIndicator = (): HTMLElement | null => {
  const container = $('#messagesContainer');
  if (!container) return null;

  hideElement('welcomeScreen');

  const frag = cloneTemplate('tpl-typing');
  const el = frag.querySelector('.ai-message') as HTMLElement | null;
  if (!el) return null;

  container.appendChild(frag);
  container.scrollTop = container.scrollHeight;

  return container.lastElementChild as HTMLElement;
};

export const removeTypingIndicator = (el: HTMLElement): void => {
  el.remove();
};

export const renderConnectedProject = (): void => {
  const projectList = $('#projectList');
  if (!projectList) return;

  import('./storage').then(({ getConnectedProject, clearConnectedProject }) => {
    const project = getConnectedProject();
    projectList.innerHTML = '';

    if (project) {
      const frag = cloneTemplate('tpl-project-connected');
      const nameEl = frag.querySelector('.ai-project-name');
      const pathEl = frag.querySelector('.ai-project-path');
      if (nameEl) nameEl.textContent = project.name;
      if (pathEl) pathEl.textContent = project.path;

      const disconnectBtn = frag.querySelector('.disconnect-btn');
      disconnectBtn?.addEventListener('click', () => {
        clearConnectedProject();
        renderConnectedProject();
        showToast('Projeto desconectado', 'success');
      });

      projectList.appendChild(frag);
    } else {
      const empty = cloneTemplate('tpl-project-empty');
      projectList.appendChild(empty);
    }
  });
};

export const renderProjectsList = (): void => {
  const projectsList = $('#projectsList');
  if (!projectsList) return;

  import('./storage').then(({ getProjects }) => {
    const projects = getProjects();
    projectsList.innerHTML = '';

    if (projects.length > 0) {
      projects.forEach((project) => {
        const frag = cloneTemplate('tpl-project-list-item');
        const nameEl = frag.querySelector('.ai-project-name');
        const descEl = frag.querySelector('.ai-project-path');
        if (nameEl) nameEl.textContent = project.name;
        if (descEl) descEl.textContent = project.description || 'Sem descrição';
        projectsList.appendChild(frag);
      });
    } else {
      const empty = cloneTemplate('tpl-project-empty');
      projectsList.appendChild(empty);
    }
  });
};

export const setInputValue = (id: string, value: string): void => {
  const input = $(`#${id}`) as HTMLInputElement | null;
  if (input) input.value = value;
};

export const getInputValue = (id: string): string => {
  const input = $(`#${id}`) as HTMLInputElement | null;
  return input?.value ?? '';
};

export const setDataset = (id: string, key: string, value: string): void => {
  const el = $(`#${id}`);
  if (el) el.dataset[key] = value;
};

export const getDataset = (id: string, key: string): string | undefined => {
  const el = $(`#${id}`);
  return el?.dataset[key];
};

export const clearInput = (id: string): void => {
  setInputValue(id, '');
  const el = $(`#${id}`);
  if (el) delete el.dataset.attachedImage;
};
