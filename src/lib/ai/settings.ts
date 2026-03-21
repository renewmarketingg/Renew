export interface AiSettings {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
  systemPrompt: string;
}

const DEFAULT_SETTINGS: AiSettings = {
  defaultModel: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1.0,
  presencePenalty: 0.0,
  frequencyPenalty: 0.0,
  systemPrompt:
    'Você é um assistente de IA prestativo. Responda em Português (Brasil), a menos que seja explicitamente solicitado de outra forma.',
};

const SETTINGS_KEY = 'ai_settings';

export const getSettings = (): AiSettings => {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;

  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return DEFAULT_SETTINGS;

  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Partial<AiSettings>): AiSettings => {
  const current = getSettings();
  const updated = { ...current, ...settings };

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  }

  return updated;
};

export const resetSettings = (): AiSettings => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(SETTINGS_KEY);
  }
  return DEFAULT_SETTINGS;
};

interface ProviderInfo {
  id: string;
  name: string;
  apiKeyUrl: string;
  hasApiKey: boolean;
}

export const initSettingsModal = (): void => {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsModal');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const temperatureSlider = document.getElementById('aiTemperature') as HTMLInputElement | null;
  const tempValue = document.getElementById('tempValue');
  const defaultModelSelect = document.getElementById('defaultModel') as HTMLSelectElement | null;
  const maxTokensSelect = document.getElementById('maxTokens') as HTMLSelectElement | null;
  const systemPromptTextarea = document.getElementById(
    'systemPrompt'
  ) as HTMLTextAreaElement | null;
  const topPSlider = document.getElementById('aiTopP') as HTMLInputElement | null;
  const topPValue = document.getElementById('topPValue');
  const presencePenaltySlider = document.getElementById(
    'aiPresencePenalty'
  ) as HTMLInputElement | null;
  const presencePenaltyValue = document.getElementById('presencePenaltyValue');
  const frequencyPenaltySlider = document.getElementById(
    'aiFrequencyPenalty'
  ) as HTMLInputElement | null;
  const frequencyPenaltyValue = document.getElementById('frequencyPenaltyValue');

  if (!settingsBtn || !settingsModal) return;

  const loadProviderStatus = async (): Promise<void> => {
    try {
      const res = await fetch('/api/ai/providers');
      if (!res.ok) return;
      const data = await res.json();
      const providers: ProviderInfo[] = data.providers;

      providers.forEach((p) => {
        const el = document.querySelector(`[data-provider="${p.id}"]`);
        if (el) {
          el.classList.toggle('configured', p.hasApiKey);
          const dot = el.querySelector('.provider-status-dot');
          if (dot) {
            dot.setAttribute('title', p.hasApiKey ? 'Configurado' : 'Não configurado');
          }
        }
      });
    } catch {
      // Silently fail
    }
  };

  const openModal = () => {
    settingsModal.classList.add('visible');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    settingsModal.classList.remove('visible');
    document.body.classList.remove('modal-open');
  };

  const loadSettings = () => {
    const settings = getSettings();
    if (defaultModelSelect) defaultModelSelect.value = settings.defaultModel;
    if (temperatureSlider) {
      temperatureSlider.value = String(settings.temperature);
      if (tempValue) tempValue.textContent = String(settings.temperature);
    }
    if (maxTokensSelect) maxTokensSelect.value = String(settings.maxTokens);
    if (topPSlider) {
      topPSlider.value = String(settings.topP);
      if (topPValue) topPValue.textContent = String(settings.topP);
    }
    if (presencePenaltySlider) {
      presencePenaltySlider.value = String(settings.presencePenalty);
      if (presencePenaltyValue) presencePenaltyValue.textContent = String(settings.presencePenalty);
    }
    if (frequencyPenaltySlider) {
      frequencyPenaltySlider.value = String(settings.frequencyPenalty);
      if (frequencyPenaltyValue)
        frequencyPenaltyValue.textContent = String(settings.frequencyPenalty);
    }
    if (systemPromptTextarea) systemPromptTextarea.value = settings.systemPrompt;
  };

  settingsBtn.addEventListener('click', () => {
    loadSettings();
    loadProviderStatus();
    openModal();
  });

  closeSettingsBtn?.addEventListener('click', closeModal);

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      closeModal();
    }
  });

  temperatureSlider?.addEventListener('input', () => {
    if (tempValue) tempValue.textContent = temperatureSlider.value;
  });

  topPSlider?.addEventListener('input', () => {
    if (topPValue) topPValue.textContent = topPSlider.value;
  });

  presencePenaltySlider?.addEventListener('input', () => {
    if (presencePenaltyValue) presencePenaltyValue.textContent = presencePenaltySlider.value;
  });

  frequencyPenaltySlider?.addEventListener('input', () => {
    if (frequencyPenaltyValue) frequencyPenaltyValue.textContent = frequencyPenaltySlider.value;
  });

  saveSettingsBtn?.addEventListener('click', () => {
    const newSettings: Partial<AiSettings> = {
      defaultModel: defaultModelSelect?.value || 'gpt-4o',
      temperature: temperatureSlider ? parseFloat(temperatureSlider.value) : 0.7,
      maxTokens: maxTokensSelect ? parseInt(maxTokensSelect.value) : 4096,
      topP: topPSlider ? parseFloat(topPSlider.value) : 1.0,
      presencePenalty: presencePenaltySlider ? parseFloat(presencePenaltySlider.value) : 0.0,
      frequencyPenalty: frequencyPenaltySlider ? parseFloat(frequencyPenaltySlider.value) : 0.0,
      systemPrompt: systemPromptTextarea?.value || DEFAULT_SETTINGS.systemPrompt,
    };

    saveSettings(newSettings);
    closeModal();

    const toast = document.getElementById('toast');
    if (toast) {
      const msgEl = toast.querySelector('.toast-message');
      if (msgEl) msgEl.textContent = 'Configurações salvas!';
      const iconEl = toast.querySelector('.toast-icon');
      if (iconEl) iconEl.textContent = '✓';
      toast.dataset.type = 'success';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsModal.classList.contains('visible')) {
      closeModal();
    }
  });
};

export const initImagineModal = (): void => {
  const imagineBtn = document.getElementById('imageGenBtn');
  const imagineModal = document.getElementById('imagineModal');
  const closeImagineBtn = document.getElementById('closeImagineModal');
  const generateBtn = document.getElementById('generateImageBtn');
  const imagePrompt = document.getElementById('imagePrompt') as HTMLTextAreaElement | null;

  if (!imagineBtn || !imagineModal) return;

  const openModal = () => {
    imagineModal.classList.add('visible');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    imagineModal.classList.remove('visible');
    document.body.classList.remove('modal-open');
  };

  imagineBtn.addEventListener('click', () => {
    openModal();
    imagePrompt?.focus();
  });

  closeImagineBtn?.addEventListener('click', closeModal);

  imagineModal.addEventListener('click', (e) => {
    if (e.target === imagineModal) {
      closeModal();
    }
  });

  generateBtn?.addEventListener('click', async () => {
    const prompt = imagePrompt?.value.trim();
    if (!prompt) return;

    closeModal();

    const chatInput = document.getElementById('chatInput') as HTMLTextAreaElement | null;
    if (chatInput) {
      chatInput.value = `Crie uma imagem de: ${prompt}`;
      chatInput.focus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imagineModal.classList.contains('visible')) {
      closeModal();
    }
  });
};
