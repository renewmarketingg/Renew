# Renew Digital

Website da Renew Digital, agência de serviços digitais especializada.

## Tecnologias

- **Astro 5** - Framework web moderno com SSR
- **TypeScript** - Linguagem com tipagem estática (strict mode)
- **Astro DB (Turso)** - Banco de dados SQL remoto
- **astro-icon** - Ícones Lucide
- **CSS Variables** - Sistema de temas (dark/light)
- **Vercel** - Deploy, Analytics e Speed Insights

## Instalação

```bash
pnpm install
```

## Comandos

| Comando        | Ação                        |
| -------------- | --------------------------- |
| `pnpm dev`     | Servidor de desenvolvimento |
| `pnpm build`   | Build para produção         |
| `pnpm preview` | Visualizar build local      |
| `pnpm check`   | Verificar tipos TypeScript  |
| `pnpm format`  | Formatador Prettier         |
| `pnpm db`      | Push schema para DB remoto  |

## Autenticação

Sistema de autenticação seguro com sessão baseada em token HMAC.

### Login do Proprietário

- Página: `/login`
- Usa email e senha do ambiente (`.env`)
- Cria cookie httpOnly assinado para sessão
- Acesso total ao admin

### Segurança

- Rate limiting (5 tentativas, 15min bloqueio)
- HMAC-SHA256 para assinar tokens
- Timing-safe comparison
- Cookie httpOnly, secure, sameSite

### Variáveis de Ambiente

```env
# Owner (obrigatório para /login)
ADMIN_OWNER_EMAIL=seu-email@exemplo.com
ADMIN_PASSWORD=sua-senha-segura
ADMIN_SESSION_SECRET=sua-chave-secreta-32-caracteres

# Astro DB (Turso)
ASTRO_DB_REMOTE_URL=libsql://...
ASTRO_DB_APP_TOKEN=...
```

## Funcionalidades

- Tema claro/escuro com toggle (localStorage)
- Design responsivo (mobile, tablet, desktop)
- Animações CSS suaves
- Acessibilidade (aria-labels, semantic HTML)
- Componentes reutilizáveis
- SEO otimizado (Open Graph, Schema.org, Sitemap)
- Chat de IA (`/ai`)
- Painel administrativo
- Sistema de loja com carrinho de compras
- Produtos via banco de dados ou afiliados

## Estrutura

```
src/
├── components/          # Componentes multi-arquivo
│   └── ui/            # Componentes atômicos (Button, Card, etc)
├── constants/          # Dados estáticos
├── db/                 # Configuração Astro DB
├── layouts/            # Layouts (Layout.astro)
├── lib/
│   ├── ai/           # Módulo de chat IA
│   ├── auth/         # Autenticação (owner session, credentials)
│   └── cart/         # Sistema de carrinho
├── pages/
│   ├── api/          # Endpoints API
│   │   └── auth/     # API auth (login/logout owner)
│   └── admin/        # Páginas admin
├── services/          # Lógica de negócio
├── styles/            # Estilos globais e módulos
└── types/             # Tipos TypeScript
```

## Uso do Layout

```astro
---
import Layout from "../layouts/Layout.astro";
---

<!-- Layout normal -->
<Layout title="Minha Página">...</Layout>

<!-- Layout admin -->
<Layout title="Admin" adm={true} activePage="/admin">
  ...
</Layout>
```

## Cores (CSS Variables)

```css
--color-primary: #8414e3;
--color-primary-light: #c51be4;
--color-white: #f4f2f4;
--color-dark: #242424;
--color-gray-400: #747474;
```

## Breakpoints

- Mobile: < 768px
- Tablet: 768px – 992px
- Desktop: > 992px

## Convenções de Código

### TypeScript

- Use `export const` em vez de `export function`
- Organize tipos em `src/types/`
- Use `interface` para props de componentes Astro

### Componentes

- Estrutura: `src/components/Nome/Nome.astro`
- Estilos: `src/components/Nome/Nome.module.css`
- Nomenclatura: PascalCase

### Estilo

- Use Prettier: `pnpm format`
- Verifique tipos: `pnpm check`
