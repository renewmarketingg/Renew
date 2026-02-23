# Renew Digital - Website

Website da Renew Digital, agência de serviços digitais especializada.

## 🚀 Tecnologias

- **Astro 5.17.1** - Framework web moderno
- **TypeScript** - Linguagem com tipagem estática
- **astro-icon** - Ícones Lucide
- **CSS Variables** - Sistema de temas (dark/light)

## 📦 Instalação

```bash
npm install
```

## 🛠️ Comandos

| Comando | Ação |
|---------|------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run preview` | Visualizar build local |
| `npx astro check` | Verificar tipos TypeScript |
| `npx tsc --noEmit` | Verificar tipos sem emitir |

## 🎨 Funcionalidades

- 🌙 Tema claro/escuro com toggle (localStorage)
- 📱 Design responsivo (mobile, tablet, desktop)
- ✨ Animações CSS suaves
- ♿ Acessibilidade (aria-labels, semantic HTML)
- 🎯 Componentes reutilizáveis
- 🎴 Cards interativos com efeitos 3D na Hero Section

## 📁 Estrutura

```
src/
├── components/              # Componentes Astro
│   ├── button/             # Botão reutilizável
│   ├── card/               # Card genérico
│   ├── footer/             # Footer com links
│   ├── header/             # Header com nav e toggle
│   ├── hero/               # Seção hero com cards interativos
│   ├── icon-wrapper/       # Wrapper para ícones
│   └── list/               # Lista reutilizável
├── constants/              # Dados estáticos
├── layouts/
│   └── Layout.astro        # Layout base
├── pages/
│   └── index.astro         # Página principal
├── scripts/
│   └── header.ts           # Scripts do header
└── styles/
    ├── components.css       # Estilos dos componentes da página
    ├── variables.css       # Variáveis CSS e temas
    └── global.css          # Estilos globais
public/                     # Assets estáticos
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
