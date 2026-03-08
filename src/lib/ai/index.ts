import {
  getCurrentChatIdLocal,
  setCurrentChatIdLocal,
  createNewChat,
  loadChat,
  addMessageToChat,
  clearCurrentChat,
  updateChatModel,
} from './chat';
import { initTheme } from './theme';
import { initProjectModal } from './projects';
import {
  showToast,
  renderChatList,
  renderMessages,
  showWelcome,
  showTypingIndicator,
  removeTypingIndicator,
  setInputValue,
  getInputValue,
  clearInput,
  setDataset,
  getDataset,
  renderConnectedProject,
  renderProjectsList,
} from './ui';
import { getConnectedProject } from './storage';

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    onstart: (() => void) | null;
    onresult:
      | ((event: {
          results: { [index: number]: { [index: number]: { transcript: string } } };
        }) => void)
      | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
  }
}

let isRecording = false;
let recognition: SpeechRecognition | null = null;

const initModelSelector = (): void => {
  const modelBtn = document.getElementById('modelBtn');
  const modelDropdown = document.getElementById('modelDropdown');

  modelBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    modelDropdown?.classList.toggle('show');
  });

  document.querySelectorAll('.ai-model-option').forEach((option) => {
    option.addEventListener('click', () => {
      const model = (option as HTMLElement).dataset.model;
      const name = option.querySelector('.ai-model-name')?.textContent || '';
      const currentModelSpan = document.getElementById('currentModel');
      if (currentModelSpan) currentModelSpan.textContent = name;
      modelDropdown?.classList.remove('show');

      if (model) updateChatModel(model);
    });
  });

  document.addEventListener('click', () => {
    modelDropdown?.classList.remove('show');
  });
};

const initFileAttachment = (): void => {
  const attachBtn = document.getElementById('attachBtn');
  const fileInput = document.getElementById('fileInput');

  attachBtn?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setDataset('chatInput', 'attachedImage', imageData);
      showToast('Imagem anexada com sucesso!', 'success');
    };
    reader.readAsDataURL(file);
  });
};

const initVoiceInput = (): void => {
  const voiceBtn = document.getElementById('voiceBtn');
  if (!voiceBtn) return;

  voiceBtn.addEventListener('click', () => {
    if (isRecording) {
      recognition?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Reconhecimento de voz não suportado neste navegador', 'error');
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;

    recognition.onstart = () => {
      isRecording = true;
      voiceBtn.classList.add('recording');
      showToast('Ouvindo...', 'info');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById('chatInput') as HTMLInputElement | null;
      if (input) input.value += ` ${transcript}`;
    };

    recognition.onend = () => {
      isRecording = false;
      voiceBtn.classList.remove('recording');
    };

    recognition.onerror = () => {
      isRecording = false;
      voiceBtn.classList.remove('recording');
      showToast('Erro no reconhecimento de voz', 'error');
    };

    recognition.start();
  });
};

const initQuickActions = (): void => {
  document.querySelectorAll('.ai-quick-action').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prompt = (btn as HTMLElement).dataset.prompt;
      const input = document.getElementById('chatInput') as HTMLInputElement | null;
      if (input && prompt) {
        input.value = prompt;
        input.focus();
      }
    });
  });
};

const initNewChatButton = (): void => {
  document.getElementById('newChatBtn')?.addEventListener('click', () => {
    const chat = createNewChat();
    setCurrentChatIdLocal(chat.id);
    renderChatList();
    showWelcome();
  });
};

const initClearChat = (): void => {
  document.getElementById('clearChatBtn')?.addEventListener('click', () => {
    clearCurrentChat();
    showWelcome();
    renderChatList();
    showToast('Conversa limpa', 'success');
  });
};

const initImageGen = (): void => {
  document.getElementById('imageGenBtn')?.addEventListener('click', () => {
    setInputValue('chatInput', 'Crie uma imagem de: ');
    document.getElementById('chatInput')?.focus();
  });
};

const sendMessage = (): void => {
  const message = getInputValue('chatInput').trim();
  const attachedImage = getDataset('chatInput', 'attachedImage');

  if (!message && !attachedImage) return;

  if (!getCurrentChatIdLocal()) {
    const chat = createNewChat();
    setCurrentChatIdLocal(chat.id);
  }

  const images = attachedImage ? [attachedImage] : [];
  addMessageToChat('user', message, images);
  clearInput('chatInput');

  simulateResponse();
};

const initSendMessage = (): void => {
  document.getElementById('sendBtn')?.addEventListener('click', sendMessage);

  document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
};

const simulateResponse = (): void => {
  const typingEl = showTypingIndicator();
  if (!typingEl) return;

  setTimeout(() => {
    removeTypingIndicator(typingEl);

    const connectedProject = getConnectedProject();
    let responseText: string;

    if (connectedProject) {
      responseText = `Entendi! Vou analisar o projeto "${connectedProject.name}" e ajudá-lo com o que precisar. O projeto está conectado em: ${connectedProject.path}`;
    } else {
      responseText =
        'Entendi sua mensagem! Ainda não tenho uma conexão com a API configurada, mas a interface está pronta. Você pode configurar as chaves de API nas variáveis de ambiente para começar a usar.';
    }

    addMessageToChat('assistant', responseText);
    renderChatList();
  }, 1500);
};

export const initAI = (): void => {
  initTheme();
  initModelSelector();
  initFileAttachment();
  initVoiceInput();
  initQuickActions();
  initNewChatButton();
  initClearChat();
  initImageGen();
  initProjectModal();
  initSendMessage();
  renderProjectsList();
  renderConnectedProject();

  const chatId = localStorage.getItem('ai_current_chat');
  if (chatId) {
    setCurrentChatIdLocal(chatId);
    const chat = loadChat(chatId);
    if (chat) {
      renderMessages(chat.messages);
      renderChatList();
    }
  } else {
    const chat = createNewChat();
    setCurrentChatIdLocal(chat.id);
    renderChatList();
    showWelcome();
  }
};

document.addEventListener('DOMContentLoaded', initAI);

export { showToast };
