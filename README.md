# Renew Digital

Website da Renew Digital, agência de serviços digitais especializada.

## 🚀 Tecnologias

- **Astro 5.17.1** - Framework web moderno
- **TypeScript** - Linguagem com tipagem estática
- **astro-icon** - Ícones Lucide
- **CSS Variables** - Sistema de temas (dark/light)
- **Vercel** - Analytics e Speed Insights

## 📦 Instalação

```bash
pnpm install
```

## 🛠️ Comandos

| Comando | Ação |
|---------|------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build para produção |
| `pnpm preview` | Visualizar build local |
| `pnpm typecheck` | Verificar tipos TypeScript |
| `pnpm lint` | Verificar código com ESLint |
| `pnpm format` | Formatar código com Prettier |

## 🎨 Funcionalidades

- 🌙 Tema claro/escuro com toggle (localStorage)
- 📱 Design responsivo (mobile, tablet, desktop)
- ✨ Animações CSS suaves
- ♿ Acessibilidade (aria-labels, semantic HTML)
- 🎯 Componentes reutilizáveis
- 🎴 Cards interativos com efeitos 3D na Hero Section
- 📊 SEO otimizado (Open Graph, Schema.org, Sitemap)
- ⚡ Performance (Vercel Speed Insights)

## 📁 Estrutura

```
src/
├── components/           # Componentes Astro
│   ├── Button.astro       # Botão reutilizável
│   ├── Card.astro        # Card genérico
│   ├── Contact.astro     # Seção de contato com formulário
│   ├── Footer.astro      # Footer com links
│   ├── Header.astro      # Header com nav e toggle
│   ├── Hero.astro        # Seção hero com cards interativos
│   ├── IconWrapper.astro # Wrapper para ícones
│   └── List.astro        # Lista reutilizável
├── constants/            # Dados estáticos (serviços, links, etc.)
├── layouts/
│   └── Layout.astro      # Layout base
├── pages/
│   └── index.astro       # Página principal
└── styles/
    ├── components.css    # Estilos dos componentes da página
    ├── variables.css    # Variáveis CSS e temas
    └── global.css       # Estilos globais
public/                   # Assets estáticos
```

## 🎨 Cores (CSS Variables)

```css
--color-primary: #8414e3;
--color-primary-light: #c51be4;
--color-white: #f4f2f4;
--color-dark: #242424;
--color-gray-400: #747474;
```

## 📱 Breakpoints

- Mobile: < 768px
- Tablet: 768px - 992px
- Desktop: > 992px
