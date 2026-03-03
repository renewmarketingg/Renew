# Renew Digital

Website da Renew Digital, agência de serviços digitais especializada.

## Tecnologias

- **Astro 5** - Framework web moderno
- **TypeScript** - Linguagem com tipagem estática
- **Clerk** - Autenticação e gerenciamento de usuários
- **astro-icon** - Ícones Lucide
- **CSS Variables** - Sistema de temas (dark/light)
- **Vercel** - Analytics e Speed Insights

## Instalação

```bash
pnpm install
```

## Comandos

| Comando           | Ação                        |
| ----------------- | --------------------------- |
| `pnpm dev`        | Servidor de desenvolvimento |
| `pnpm build`      | Build para produção         |
| `pnpm preview`    | Visualizar build local      |
| `npx astro check` | Verificar tipos TypeScript  |

## Autenticação Admin

O sistema de autenticação do admin utiliza:

- **Clerk** - Plataforma de autenticação gerenciada
- **Emails autorizados** - Apenas emails na lista branca podem acessar (configurados em `src/constants/allowedEmails.ts`)

### Configuração do Clerk

1. Crie uma conta em [clerk.com](https://clerk.com)
2. Crie uma nova aplicação
3. Configure as variáveis de ambiente:

```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

4. Adicione os emails autorizados em `src/constants/allowedEmails.ts`

5. Configure as URLs de redirecionamento no Clerk Dashboard:
   - Sign-in redirect: `/admin`
   - Sign-up redirect: `/admin`

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Clerk (obrigatório para admin)
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Emails autorizados (opcional - pode adicionar diretamente no código)
PH_EMAIL=seu-email@exemplo.com
RAFA_EMAIL=seu-email@exemplo.com
FABIO_EMAIL=seu-email@exemplo.com
```

Na **Vercel**, adicione as variáveis nas configurações de Environment Variables do projeto.

## Funcionalidades

- Tema claro/escuro com toggle (localStorage)
- Design responsivo (mobile, tablet, desktop)
- Animações CSS suaves
- Acessibilidade (aria-labels, semantic HTML)
- Componentes reutilizáveis
- SEO otimizado (Open Graph, Schema.org, Sitemap)
- Performance (Vercel Speed Insights)
- Sistema de autenticação admin com Clerk

## Estrutura

```
src/
├── components/
│   ├── admin/
│   │   ├── filters/
│   │   ├── modal/
│   │   ├── stats-grid/
│   │   └── table/
│   ├── button/
│   ├── card/
│   ├── contact/
│   ├── footer/
│   ├── header/
│   ├── hero/
│   ├── icon-wrapper/
│   ├── list/
│   ├── page-header/
│   └── stats-card/
├── constants/
│   ├── affiliateProducts.ts
│   ├── allowedEmails.ts
│   ├── features.ts
│   ├── infoCards.ts
│   ├── quickLinks.ts
│   ├── services.ts
│   └── socialLinks.ts
├── lib/
│   └── admin.ts
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── admin/
│   │   ├── index.astro
│   │   ├── login.astro
│   │   ├── logs.astro
│   │   ├── routes.astro
│   │   ├── settings.astro
│   │   └── signout.astro
│   ├── index.astro
│   ├── store.astro
│   └── 404.astro
├── styles/
│   ├── admin.css
│   ├── global.css
│   ├── store.css
│   └── variables.css
└── middleware.ts
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
