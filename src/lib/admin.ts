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

  clearTimeout(
    (toast as HTMLElement & { _toastTimer?: ReturnType<typeof setTimeout> })._toastTimer
  );
  (toast as HTMLElement & { _toastTimer?: ReturnType<typeof setTimeout> })._toastTimer = setTimeout(
    () => toast.classList.remove('show'),
    3000
  );
};

export const initModals = (): void => {
  document.querySelectorAll<HTMLElement>('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.close;
      if (id) document.getElementById(id)?.classList.remove('visible');
    });
  });

  document.querySelectorAll<HTMLElement>('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('visible');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document
        .querySelectorAll<HTMLElement>('.modal-overlay.visible')
        .forEach((m) => m.classList.remove('visible'));
    }
  });
};

export const openModal = (id: string): void => {
  document.getElementById(id)?.classList.add('visible');
};

export const closeModal = (id: string): void => {
  document.getElementById(id)?.classList.remove('visible');
};

export const formatDateTime = (isoString: string): string => {
  return new Date(isoString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getItems = <T>(key: string, defaultValue: T[]): T[] => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

export const setItems = <T>(key: string, items: T[]): void => {
  localStorage.setItem(key, JSON.stringify(items));
};

export const generateId = (prefix = 'item'): string => {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};
