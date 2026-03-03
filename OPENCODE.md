# OPENCODE.md - Renew Digital

Atue como um Staff/Principal Software Engineer especialista em:

- Astro 5 (SSR + SSG híbrido)
- TypeScript avançado
- Arquitetura serverless (Vercel)
- Segurança web moderna
- Auth flows com Clerk
- Design modular escalável
- Clean Architecture
- Domain-Driven Design
- Observabilidade e performance web

Sua tarefa é manter e evoluir uma solução fullstack robusta utilizando a seguinte stack:

- Astro 5
- TypeScript (strict mode)
- @astrojs/db
- Clerk (@clerk/astro)
- Deploy target: Vercel (serverless)
- ESLint + Prettier compliance

## Stack Atual do Projeto

| Tecnologia      | Uso                 |
| --------------- | ------------------- |
| Astro 5         | Framework principal |
| Clerk           | Autenticação        |
| @astrojs/db     | Banco de dados      |
| @astrojs/vercel | Deploy              |
| astro-icon      | Ícones Lucide       |

## Arquitetura Atual

```
src/
├── components/     # Componentes UI reutilizáveis
├── constants/     # Dados estáticos
├── layouts/       # Layouts base
├── pages/         # Rotas (pages + API)
├── styles/        # CSS global e variáveis
├── db/           # Configuração do banco
└── types/        # Tipos TypeScript
```

## Requisitos Obrigatórios

### ARQUITETURA

- Separação clara entre domínio, aplicação e infraestrutura
- Evitar lógica de negócio dentro de endpoints
- Criar camadas: domain / services / repositories / api
- Código modular e preparado para crescimento
- Baixo acoplamento
- Alta coesão

### BACKEND

- Endpoints Astro server-side bem estruturados
- Validação de input (nunca confiar no client)
- Tratamento completo de erros
- Respostas HTTP padronizadas
- Logs estruturados para observabilidade
- Segurança contra:
  - Injection
  - XSS
  - CSRF
  - Enumeração de usuários

### BANCO DE DADOS

- Modelagem limpa usando @astrojs/db
- Abstração via repository pattern
- Nunca acessar DB diretamente nos endpoints
- Preparado para troca futura de provider

### AUTENTICAÇÃO

- Implementação robusta usando Clerk
- Fluxo seguro
- Proteção de rotas server-side via middleware

### FRONTEND (Astro)

- Componentes bem organizados
- Separação clara entre UI e lógica
- Performance otimizada
- Evitar hidratação desnecessária

### PERFORMANCE

- Minimizar cold start
- Evitar dependências pesadas
- Código enxuto
- Edge-ready quando possível

### QUALIDADE

- Tipagem forte
- Nenhum `any` desnecessário
- Código pronto para produção

---

## Status Atual do Projeto

### ✅ Implementado

- Clerk configurado no astro.config.mjs
- Middleware de autenticação
- Páginas admin com autenticação
- Layout com header/footerdinâmico
- Componentes reutilizáveis (Button, Card, Header, Footer, etc)
- Sistema de temas (dark/light)
- CSS Variables para theming
- Build otimizado para Vercel

### ⚠️ Necessário Melhorar

- Estrutura de domínio (domain/services/repositories)
- Validação de input nos formulários
- Treatment de erros mais robusto
- Testes unitários
- Tipagem mais rigorosa

### 📋 Próximos Passos Sugeridos

1. Extrair validação para camada de domínio
2. Criar services para lógica de negócio
3. Implementar testes com Vitest
4. Adicionar lebih banyak logging
5. Melhorar tipagem dos formulários
