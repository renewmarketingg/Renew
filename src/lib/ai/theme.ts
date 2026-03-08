const getThemeToggle = (): HTMLElement | null => {
  return document.getElementById('themeToggleBtn');
};

const getHtml = (): HTMLElement | null => {
  return document.documentElement;
};

const getStoredTheme = (): string => {
  return localStorage.getItem('theme') || 'dark';
};

const setThemeAttribute = (theme: string): void => {
  const html = getHtml();
  if (html) html.setAttribute('data-theme', theme);
};

const storeTheme = (theme: string): void => {
  localStorage.setItem('theme', theme);
};

export const initTheme = (): void => {
  const toggle = getThemeToggle();
  if (!toggle) return;

  const savedTheme = getStoredTheme();
  setThemeAttribute(savedTheme);

  toggle.addEventListener('click', () => {
    const current = getHtml()?.getAttribute('data-theme') || 'dark';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setThemeAttribute(newTheme);
    storeTheme(newTheme);
  });
};

export const getCurrentTheme = (): string => {
  return getStoredTheme();
};
