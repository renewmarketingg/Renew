export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info'): void => {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const msgEl = toast.querySelector('.toast-message');
  if (msgEl) msgEl.textContent = message;

  const icons: Record<string, string> = { success: '✓', error: '✕', info: 'ℹ' };
  const iconEl = toast.querySelector('.toast-icon');
  if (iconEl) iconEl.textContent = icons[type] ?? '';

  toast.dataset.type = type;
  toast.classList.add('show');

  const timeoutId = setTimeout(() => toast.classList.remove('show'), 3000);
  (toast as HTMLElement & { _toastTimer?: ReturnType<typeof setTimeout> })._toastTimer = timeoutId;
};

export const openModal = (id: string): void => {
  document.getElementById(id)?.classList.add('visible');
  document.body.classList.add('modal-open');
};

export const closeModal = (id: string): void => {
  document.getElementById(id)?.classList.remove('visible');
  document.body.classList.remove('modal-open');
};

export const closeAllModals = (): void => {
  document.querySelectorAll('.modal-overlay.visible').forEach((m) => m.classList.remove('visible'));
  document.body.classList.remove('modal-open');
};

export const initModals = (): void => {
  document.querySelectorAll<HTMLElement>('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.close;
      if (id) closeModal(id);
    });
  });

  document.querySelectorAll<HTMLElement>('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('visible');
        document.body.classList.remove('modal-open');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
};

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatDateTime = (isoString: string): string =>
  new Date(isoString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const generateId = (prefix = 'item'): string =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const getItems = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setItems = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail
  }
};
