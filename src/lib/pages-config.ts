export interface PageInfo {
  path: string;
  label: string;
  category: string;
  dynamic: boolean;
  params?: string[];
}

const CATEGORY_MAP: Record<string, string> = {
  admin: 'Admin',
  api: 'API',
  docs: 'Documentação',
};

const LABEL_OVERRIDES: Record<string, string> = {
  index: 'Início',
  store: 'Loja',
  ai: 'IA',
  login: 'Login',
  logout: 'Sair',
  '404': 'Não encontrado',
};

function extractLabel(filename: string): string {
  const base = filename.replace(/\[\w+\]/g, 'Dynamic');
  const name = base.replace(/\.astro$/, '');
  return LABEL_OVERRIDES[name] || name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function detectCategory(path: string): string {
  const parts = path.split('/');
  for (const part of parts) {
    if (CATEGORY_MAP[part]) return CATEGORY_MAP[part];
  }
  return 'Público';
}

function extractParams(path: string): string[] {
  const matches = path.match(/\[(\w+)\]/g) || [];
  return matches.map((m) => m.slice(1, -1));
}

function pathToUrl(path: string): string {
  return path
    .replace(/^pages/, '')
    .replace(/\/index\.astro$/, '/')
    .replace(/\.astro$/, '/')
    .replace(/\[(\w+)\]/g, ':$1');
}

export function getPages(): PageInfo[] {
  const modules = import.meta.glob('../pages/**/*.astro', { eager: true });

  return Object.keys(modules)
    .map((rawPath) => {
      const filename = rawPath.split('/').pop() || '';
      const category = detectCategory(rawPath);
      const isDynamic = rawPath.includes('[');

      return {
        path: pathToUrl(rawPath),
        label: extractLabel(filename),
        category,
        dynamic: isDynamic,
        params: isDynamic ? extractParams(rawPath) : undefined,
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function getPublicPages(): PageInfo[] {
  return getPages().filter(
    (p) => !p.path.includes('/admin/') && !p.path.includes('/api/') && !p.path.includes('/logout')
  );
}
