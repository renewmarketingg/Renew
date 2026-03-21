import {
  getCurrentChatIdLocal,
  setCurrentChatIdLocal,
  createNewChat,
  loadChat,
  addMessageToChat,
  clearCurrentChat,
  updateChatModel,
  renameChat,
} from './chat';
import { initTheme } from './theme';
import { initProjectModal } from './projects';
import { sendMessage as aiSendMessage } from './chat-service';
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
import { initSettingsModal, initImagineModal, getSettings } from './settings';

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
    e.preventDefault();
    e.stopPropagation();
    modelDropdown?.classList.toggle('show');
  });

  document.querySelectorAll('.ai-model-option').forEach((option) => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const model = (option as HTMLElement).dataset.model;
      const name = option.querySelector('.ai-model-name')?.textContent || '';
      const currentModelSpan = document.getElementById('currentModel');
      if (currentModelSpan) currentModelSpan.textContent = name;
      modelDropdown?.classList.remove('show');

      if (model) {
        updateChatModel(model);
        const currentChat = loadChat(getCurrentChatIdLocal() || '');
        if (currentChat) {
          currentChat.model = model;
          renderMessages(currentChat.messages);
        }
      }
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
  const btn = document.getElementById('newChatBtn');
  btn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const chat = createNewChat();
    setCurrentChatIdLocal(chat.id);
    renderChatList();
    showWelcome();
  });
};

const initClearChat = (): void => {
  const btn = document.getElementById('clearChatBtn');
  btn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
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

const initInputListener = (): void => {
  const chatInput = document.getElementById('chatInput') as HTMLTextAreaElement | null;
  if (!chatInput) return;

  chatInput.addEventListener('input', () => {
    const currentChat = loadChat(getCurrentChatIdLocal() || '');
    if (currentChat && currentChat.messages.length === 0 && currentChat.title === 'Nova conversa') {
      const preview = chatInput.value.substring(0, 30) + (chatInput.value.length > 30 ? '...' : '');
      if (preview.trim()) {
        renameChat(currentChat.id, preview);
        renderChatList();
      }
    }
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

  const currentChat = loadChat(getCurrentChatIdLocal() || '');
  if (currentChat) {
    const preview = message.substring(0, 30) + (message.length > 30 ? '...' : '');
    if (currentChat.messages.length === 1) {
      renameChat(currentChat.id, preview);
      renderChatList();
    }
  }

  handleAIResponse();
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

const handleAIResponse = async (): Promise<void> => {
  const typingEl = showTypingIndicator();
  if (!typingEl) return;

  try {
    const currentChat = loadChat(getCurrentChatIdLocal() || '');
    if (!currentChat) {
      removeTypingIndicator(typingEl);
      return;
    }

    const settings = getSettings();
    const modelSettings = {
      model: currentChat.model || settings.defaultModel,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      topP: settings.topP,
      presencePenalty: settings.presencePenalty,
      frequencyPenalty: settings.frequencyPenalty,
      systemPrompt: settings.systemPrompt,
    };

    const messages = currentChat.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const responseText = await aiSendMessage({
      messages,
      ...modelSettings,
    });

    removeTypingIndicator(typingEl);
    addMessageToChat('assistant', responseText);
    renderChatList();
  } catch (error) {
    removeTypingIndicator(typingEl);
    showToast('Erro ao gerar resposta. Verifique sua chave de API.', 'error');
    addMessageToChat(
      'assistant',
      'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, verifique se a chave de API está configurada corretamente.'
    );
    renderChatList();
  }
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
  initSettingsModal();
  initImagineModal();
  initSendMessage();
  initInputListener();
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

export { showToast };
