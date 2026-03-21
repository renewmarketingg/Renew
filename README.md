# Renew Digital

Website da Renew Digital, agência de serviços digitais especializada.

## Tecnologias

- **Astro 5** - Framework web moderno com Vercel Adapter para SSR
- **TypeScript** - Linguagem com tipagem estática (strict mode)
- **Astro DB (Turso)** - Banco de dados SQL edge-ready
- **AI SDK (Vercel)** - Abstração de múltiplos provedores de IA
- **Vitest** - Framework de testes
- **Prettier** - Formatador de código
- **astro-icon** - Ícones Lucide e Tabler
- **CSS Variables** - Sistema de temas (dark/light)
- **Vercel** - Deploy, Analytics e Speed Insights

## Instalação

```bash
pnpm install
```

## Comandos

| Comando              | Ação                          |
| -------------------- | ----------------------------- |
| `pnpm dev`           | Servidor de desenvolvimento   |
| `pnpm build`         | Build para produção           |
| `pnpm preview`       | Visualizar build local        |
| `pnpm check`         | Verificar tipos TypeScript    |
| `pnpm format`        | Formatador Prettier           |
| `pnpm db`            | Push schema para DB remoto    |
| `pnpm test`          | Executar testes (Vitest)      |
| `pnpm test:watch`    | Executar testes em watch mode |
| `pnpm test:coverage` | Executar testes com cobertura |

## Autenticação

Sistema de autenticação seguro com sessão baseada em token HMAC.

### Login do Proprietário

- Página: `/login`
- Usa email e senha do ambiente (`.env`)
- Cria cookie httpOnly assinado para sessão
- Acesso total ao admin

### Segurança

- Rate limiting (100 requisições/minuto por IP nas APIs)
- HMAC-SHA256 para assinar tokens
- Cookie httpOnly, secure, sameSite
- bcrypt para hash de senha
- Security headers em todas as respostas

### Variáveis de Ambiente

```env
# Owner (obrigatório para /login)
ADMIN_OWNER_EMAIL=seu-email@exemplo.com
ADMIN_PASSWORD=sua-senha-segura
ADMIN_SESSION_SECRET=sua-chave-secreta-32-caracteres

# Astro DB (Turso)
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...

# IA (opcional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Funcionalidades

- Tema claro/escuro com toggle
- Design responsivo (mobile, tablet, desktop)
- Animações CSS suaves
- Acessibilidade (aria-labels, semantic HTML)
- SEO otimizado (Open Graph, Schema.org, Sitemap)
- Chat de IA com múltiplos provedores (`/ai`): OpenAI, Anthropic, Google, Groq, Mistral, Cohere
- Painel administrativo completo
- Sistema de loja com carrinho de compras
- Produtos via banco de dados ou afiliados

## Estrutura

```
src/
├── actions/           # Server actions
├── components/        # Componentes Astro
│   └── ui/           # Componentes atômicos (Button, Card, Toast, etc)
├── constants/         # Dados estáticos
├── db/                # Configuração Astro DB
├── layouts/           # Layouts (Layout.astro, Seo.astro)
├── lib/
│   ├── ai/           # Módulo de chat IA
│   ├── auth/         # Autenticação (owner, visitor)
│   ├── cart/         # Sistema de carrinho (store, client, api)
│   └── ui.ts         # Utilitários (toast, modal, format)
├── middleware.ts      # Middleware (auth, rate limiting)
├── pages/
│   ├── admin/        # Páginas admin
│   └── api/          # Endpoints API
├── schemas/           # Schemas Zod
├── services/          # Lógica de negócio
├── styles/            # Estilos globais e módulos CSS
├── types/             # Tipos TypeScript
└── utils/            # Utilitários (IDs, formatação)
```

## Convenções de Código

### TypeScript

- Use `export const` em vez de `export function`
- Use `interface` para props de componentes Astro
- Use `type` para unions e intersections
- Sempre especifique tipos de retorno
- Nunca use `any` - use `unknown` quando o tipo é desconhecido

### Componentes

- Estrutura: `src/components/Nome/Nome.astro`
- Estilos: `src/components/Nome/Nome.module.css`
- Nomenclatura: PascalCase

### CSS Modules

- Nomenclatura: kebab-case (`.btn-primary`)
- Arquivos: kebab-case (`Button.module.css`)

### Arquivos Não-Componentes

- Nomenclatura: kebab-case (`product-service.ts`)

### Import Organization

```typescript
// 1. Astro built-ins
import { defineMiddleware } from 'astro:middleware';

// 2. Third-party packages
import bcrypt from 'bcryptjs';
import { z } from 'astro/zod';
import { Icon } from 'astro-icon/components';

// 3. Path aliases
import { getOwnerEmailFromEnv } from '@/lib/auth/ownerCredentials';
import type { LayoutProps } from '@/types/layout';

// 4. Relative imports
import styles from './Button.module.css';
```

## Cores (CSS Variables)

```css
--color-primary: #8414e3;
--color-primary-light: #c51be4;
--color-primary-alpha-10: rgba(132, 20, 227, 0.1);
--color-white: #f4f2f4;
--color-dark: #242424;
--color-gray-400: #747474;
```

## Breakpoints

- Mobile: < 768px
- Tablet: 768px – 992px
- Desktop: > 992px

## Estilo

- Use Prettier: `pnpm format`
- Verifique tipos: `pnpm check`
- Execute testes: `pnpm test`
