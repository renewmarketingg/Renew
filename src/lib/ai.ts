// @ts-nocheck
const CHATS_KEY = 'ai_chats';
const CURRENT_CHAT_KEY = 'ai_current_chat';
const CONNECTED_PROJECT_KEY = 'ai_connected_project';
const PROJECTS_KEY = 'ai_projects';

let currentChatId = null;
let isRecording = false;
let recognition = null;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function getChats() {
  const stored = localStorage.getItem(CHATS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveChats(chats) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

function getCurrentChatId() {
  return localStorage.getItem(CURRENT_CHAT_KEY);
}

function setCurrentChatId(id) {
  localStorage.setItem(CURRENT_CHAT_KEY, id);
  currentChatId = id;
}

function getProjects() {
  const stored = localStorage.getItem(PROJECTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function createNewChat() {
  const chats = getChats();
  const newChat = {
    id: generateId(),
    title: 'Nova conversa',
    messages: [],
    model: 'gpt-4o',
    createdAt: new Date().toISOString(),
  };
  chats.unshift(newChat);
  saveChats(chats);
  setCurrentChatId(newChat.id);
  renderChatList();
  clearMessages();
  showWelcome();
}

function renameChat(chatId, newTitle) {
  const chats = getChats();
  const chatIndex = chats.findIndex((c) => c.id === chatId);
  if (chatIndex !== -1) {
    chats[chatIndex].title = newTitle;
    saveChats(chats);
    renderChatList();
  }
}

function deleteChatItem(chatId, event) {
  event.stopPropagation();
  const chats = getChats();
  const filtered = chats.filter((c) => c.id !== chatId);
  saveChats(filtered);

  if (currentChatId === chatId) {
    if (filtered.length > 0) {
      loadChat(filtered[0].id);
    } else {
      createNewChat();
    }
  } else {
    renderChatList();
  }
  showToast('Conversa excluída', 'success');
}

function renderChatList() {
  const chatList = document.getElementById('chatList');
  if (!chatList) return;

  const chats = getChats();

  const existingItems = chatList.querySelectorAll('.ai-chat-item');
  existingItems.forEach((item) => item.remove());

  chats.forEach((chat) => {
    const item = document.createElement('button');
    item.className = `ai-chat-item ${chat.id === currentChatId ? 'active' : ''}`;
    item.dataset.chatId = chat.id;

    const titleSpan = document.createElement('span');
    titleSpan.className = 'chat-title';
    titleSpan.textContent = chat.title;
    titleSpan.contentEditable = false;

    item.appendChild(titleSpan);

    item.addEventListener('click', (e) => {
      if (e.target.contentEditable === 'true') return;
      loadChat(chat.id);
    });

    item.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const span = item.querySelector('.chat-title');
      span.contentEditable = true;
      span.focus();
      span.style.cursor = 'text';

      const range = document.createRange();
      range.selectNodeContents(span);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const span = item.querySelector('.chat-title');
        span.contentEditable = false;
        span.blur();
        renameChat(chat.id, span.textContent || 'Nova conversa');
      }
      if (e.key === 'Escape') {
        const span = item.querySelector('.chat-title');
        span.contentEditable = false;
        span.textContent = chat.title;
      }
    });

    item.addEventListener('blur', () => {
      const span = item.querySelector('.chat-title');
      span.contentEditable = false;
      renameChat(chat.id, span.textContent || 'Nova conversa');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'chat-delete-btn';
    deleteBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    deleteBtn.addEventListener('click', (e) => deleteChatItem(chat.id, e));

    item.appendChild(deleteBtn);
    chatList.appendChild(item);
  });
}

function loadChat(chatId) {
  setCurrentChatId(chatId);
  const chats = getChats();
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return;

  const welcomeScreen = document.getElementById('welcomeScreen');
  if (welcomeScreen) welcomeScreen.style.display = 'none';
  renderMessages(chat.messages);
  renderChatList();
}

function renderMessages(messages) {
  const container = document.getElementById('messagesContainer');
  if (!container) return;

  container.innerHTML = '';

  messages.forEach((msg) => {
    addMessageToUI(msg.role, msg.content, msg.images);
  });
}

function clearMessages() {
  const container = document.getElementById('messagesContainer');
  if (container) container.innerHTML = '';
}

function showWelcome() {
  const welcome = document.getElementById('welcomeScreen');
  if (welcome) welcome.style.display = 'flex';
}

function addMessageToUI(role, content, images = []) {
  const container = document.getElementById('messagesContainer');
  if (!container) return;

  const welcome = document.getElementById('welcomeScreen');
  if (welcome) welcome.style.display = 'none';

  const messageDiv = document.createElement('div');
  messageDiv.className = `ai-message ai-message-${role}`;

  const avatarIcon =
    role === 'user'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';

  let imagesHtml = '';
  if (images && images.length > 0) {
    imagesHtml = `<div class="ai-message-images">
      ${images.map((img) => `<img src="${img}" alt="Imagem anexada" />`).join('')}
    </div>`;
  }

  messageDiv.innerHTML = `
    <div class="ai-message-avatar">
      ${avatarIcon}
    </div>
    <div class="ai-message-content">
      ${imagesHtml}
      <div class="ai-message-text">${content}</div>
    </div>
  `;

  container.appendChild(messageDiv);
  container.scrollTop = container.scrollHeight;
}

function addMessage(role, content, images = []) {
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
  addMessageToUI(role, content, images);
}

function simulateResponse() {
  const container = document.getElementById('messagesContainer');
  if (!container) return;

  const responseDiv = document.createElement('div');
  responseDiv.className = 'ai-message ai-message-assistant';
  responseDiv.innerHTML = `
    <div class="ai-message-avatar">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    </div>
    <div class="ai-message-content">
      <div class="ai-message-text typing">
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
      </div>
    </div>
  `;

  const welcome = document.getElementById('welcomeScreen');
  if (welcome) welcome.style.display = 'none';
  container.appendChild(responseDiv);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    responseDiv.remove();
    const connectedProject = localStorage.getItem(CONNECTED_PROJECT_KEY);
    let responseText;

    if (connectedProject) {
      const project = JSON.parse(connectedProject);
      responseText = `Entendi! Vou analisar o projeto "${project.name}" e ajudá-lo com o que precisar. O projeto está conectado em: ${project.path}`;
    } else {
      responseText =
        'Entendi sua mensagem! Ainda não tenho uma conexão com a API configurada, mas a interface está pronta. Você pode configurar as chaves de API nas variáveis de ambiente para começar a usar.';
    }

    addMessage('assistant', responseText);
  }, 1500);
}

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggleBtn');
  if (!themeToggle) return;

  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggleBtn');
  if (!themeToggle) return;

  const icon =
    theme === 'dark'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  themeToggle.innerHTML = icon;
}

function initModelSelector() {
  const modelBtn = document.getElementById('modelBtn');
  const modelDropdown = document.getElementById('modelDropdown');

  if (!modelBtn || !modelDropdown) return;

  modelBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modelDropdown.classList.toggle('show');
  });

  document.querySelectorAll('.ai-model-option').forEach((option) => {
    option.addEventListener('click', () => {
      const model = option.dataset.model;
      const name = option.querySelector('.ai-model-name').textContent;
      const currentModelSpan = document.getElementById('currentModel');
      if (currentModelSpan) currentModelSpan.textContent = name;
      modelDropdown.classList.remove('show');

      if (currentChatId) {
        const chats = getChats();
        const chatIndex = chats.findIndex((c) => c.id === currentChatId);
        if (chatIndex !== -1) {
          chats[chatIndex].model = model;
          saveChats(chats);
        }
      }
    });
  });

  document.addEventListener('click', () => {
    modelDropdown.classList.remove('show');
  });
}

function initFileAttachment() {
  const attachBtn = document.getElementById('attachBtn');
  const fileInput = document.getElementById('fileInput');

  if (!attachBtn || !fileInput) return;

  attachBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        const input = document.getElementById('chatInput');
        if (input) input.dataset.attachedImage = imageData;
        showToast('Imagem anexada com sucesso!', 'success');
      };
      reader.readAsDataURL(file);
    }
  });
}

function initVoiceInput() {
  const voiceBtn = document.getElementById('voiceBtn');
  if (!voiceBtn) return;

  voiceBtn.addEventListener('click', () => {
    if (!isRecording) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
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
          const input = document.getElementById('chatInput');
          if (input) input.value += ' ' + transcript;
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
      } else {
        showToast('Reconhecimento de voz não suportado neste navegador', 'error');
      }
    } else {
      if (recognition) recognition.stop();
    }
  });
}

function initQuickActions() {
  document.querySelectorAll('.ai-quick-action').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt;
      const input = document.getElementById('chatInput');
      if (input) {
        input.value = prompt;
        input.focus();
      }
    });
  });
}

function initNewChat() {
  const newChatBtn = document.getElementById('newChatBtn');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', createNewChat);
  }
}

function initClearChat() {
  const clearChatBtn = document.getElementById('clearChatBtn');
  if (!clearChatBtn) return;

  clearChatBtn.addEventListener('click', () => {
    if (currentChatId) {
      const chats = getChats();
      const chatIndex = chats.findIndex((c) => c.id === currentChatId);
      if (chatIndex !== -1) {
        chats[chatIndex].messages = [];
        chats[chatIndex].title = 'Nova conversa';
        saveChats(chats);
        clearMessages();
        showWelcome();
        renderChatList();
        showToast('Conversa limpa', 'success');
      }
    }
  });
}

function initImageGen() {
  const imageGenBtn = document.getElementById('imageGenBtn');
  if (imageGenBtn) {
    imageGenBtn.addEventListener('click', () => {
      const input = document.getElementById('chatInput');
      if (input) {
        input.value = 'Crie uma imagem de: ';
        input.focus();
      }
    });
  }
}

function initProjectConnect() {
  const connectProjectBtn = document.getElementById('connectProjectBtn');
  const createProjectBtn = document.getElementById('createProjectBtn');
  const closeProjectModal = document.getElementById('closeProjectModal');
  const projectModal = document.getElementById('projectModal');
  const closeCreateModal = document.getElementById('closeCreateModal');
  const createProjectModal = document.getElementById('createProjectModal');
  const saveProjectBtn = document.getElementById('saveProjectBtn');

  if (connectProjectBtn && projectModal) {
    connectProjectBtn.addEventListener('click', () => {
      projectModal.classList.add('visible');
      loadConnectedProject();
    });
  }

  if (createProjectBtn && createProjectModal) {
    createProjectBtn.addEventListener('click', () => {
      createProjectModal.classList.add('visible');
    });
  }

  if (closeProjectModal && projectModal) {
    closeProjectModal.addEventListener('click', () => {
      projectModal.classList.remove('visible');
    });
  }

  if (closeCreateModal && createProjectModal) {
    closeCreateModal.addEventListener('click', () => {
      createProjectModal.classList.remove('visible');
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('visible');
      }
    });
  }

  if (createProjectModal) {
    createProjectModal.addEventListener('click', (e) => {
      if (e.target === createProjectModal) {
        createProjectModal.classList.remove('visible');
      }
    });
  }

  if (saveProjectBtn) {
    saveProjectBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('newProjectName');
      const descInput = document.getElementById('newProjectDesc');

      const name = nameInput.value.trim();
      const description = descInput.value.trim();

      if (!name) {
        showToast('Digite um nome para o projeto', 'error');
        return;
      }

      const projects = getProjects();
      const newProject = {
        id: generateId(),
        name,
        description,
        createdAt: new Date().toISOString(),
      };

      projects.push(newProject);
      saveProjects(projects);

      nameInput.value = '';
      descInput.value = '';

      createProjectModal.classList.remove('visible');
      showToast(`Projeto "${name}" criado!`, 'success');
      loadProjectsList();
    });
  }

  const folderInput = document.getElementById('folderInput') as HTMLInputElement;
  if (folderInput) {
    folderInput.setAttribute('webkitdirectory', 'true');
    folderInput.setAttribute('directory', 'true');
    folderInput.setAttribute('multiple', 'true');

    folderInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const fullPath = file.webkitRelativePath || file.name;
        const pathParts = fullPath.split('/');
        const folderName = pathParts[0] || 'Projeto';

        const project = {
          name: folderName,
          path: fullPath,
          connectedAt: new Date().toISOString(),
        };

        localStorage.setItem(CONNECTED_PROJECT_KEY, JSON.stringify(project));
        showToast(`Pasta "${folderName}" conectada!`, 'success');
        loadConnectedProject();
        folderInput.value = '';
      }
    });
  }

  const connectFolderBtn = document.getElementById('connectFolderBtn');
  if (connectFolderBtn) {
    connectFolderBtn.addEventListener('click', () => {
      folderInput.click();
    });
  }
}

function loadConnectedProject() {
  const projectList = document.getElementById('projectList');
  if (!projectList) return;

  const connectedProject = localStorage.getItem(CONNECTED_PROJECT_KEY);

  if (connectedProject) {
    const project = JSON.parse(connectedProject);
    projectList.innerHTML = `
      <div class="ai-project-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <div class="ai-project-info">
          <div class="ai-project-name">${project.name}</div>
          <div class="ai-project-path">${project.path}</div>
        </div>
      </div>
      <button class="btn btn-danger" id="disconnectProjectBtn" style="width: 100%; margin-top: 0.5rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
        Desconectar
      </button>
    `;

    const disconnectBtn = document.getElementById('disconnectProjectBtn');
    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', () => {
        localStorage.removeItem(CONNECTED_PROJECT_KEY);
        showToast('Projeto desconectado', 'success');
        loadConnectedProject();
      });
    }
  } else {
    projectList.innerHTML = `
      <div class="ai-project-empty">
        <p>Nenhum projeto conectado</p>
      </div>
    `;
  }
}

function loadProjectsList() {
  const projectsList = document.getElementById('projectsList');
  if (!projectsList) return;

  const projects = getProjects();

  if (projects.length > 0) {
    projectsList.innerHTML = projects
      .map(
        (project) => `
      <div class="ai-project-item" data-project-id="${project.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <div class="ai-project-info">
          <div class="ai-project-name">${project.name}</div>
          <div class="ai-project-path">${project.description || 'Sem descrição'}</div>
        </div>
      </div>
    `
      )
      .join('');
  } else {
    projectsList.innerHTML = `
      <div class="ai-project-empty">
        <p>Nenhum projeto criado</p>
      </div>
    `;
  }
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;

  const message = input.value.trim();
  const attachedImage = input.dataset.attachedImage;

  if (!message && !attachedImage) return;

  if (!currentChatId) {
    createNewChat();
  }

  const images = attachedImage ? [attachedImage] : [];
  addMessage('user', message, images);
  input.value = '';
  delete input.dataset.attachedImage;

  simulateResponse();
}

function initSendMessage() {
  const sendBtn = document.getElementById('sendBtn');
  const chatInput = document.getElementById('chatInput');

  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
}

function showToast(message, type = 'info') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast toast-${type} show`;
  toast.textContent = message;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function initAI() {
  initThemeToggle();
  initModelSelector();
  initFileAttachment();
  initVoiceInput();
  initQuickActions();
  initNewChat();
  initClearChat();
  initImageGen();
  initProjectConnect();
  initSendMessage();
  loadProjectsList();

  const chatId = getCurrentChatId();
  if (chatId) {
    currentChatId = chatId;
    loadChat(chatId);
  } else {
    createNewChat();
  }
}

document.addEventListener('DOMContentLoaded', initAI);
