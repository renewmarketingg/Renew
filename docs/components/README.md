# Arquitetura de Componentes

Este projeto segue um padrão de "Pasta por Componente" para melhor organização e manutenção.

## Estrutura

Cada componente está localizado em seu próprio diretório dentro de `src/components/` ou `src/components/ui/`.

```
src/components/
├── ui/ # Componentes atômicos/primitivos
│ └── Button/
│ ├── Button.astro
│ ├── Button.module.css
│ └── Button.ts (opcional)
└── FeatureComponent/ # Componentes de alto nível/funcionalidades
├── FeatureComponent.astro
└── FeatureComponent.module.css
```

## Diretrizes

1. **Separação de responsabilidades**: Mantenha os estilos em `.module.css` e a lógica no frontmatter ou em um arquivo `.ts` separado, caso o arquivo fique muito grande.

2. **Módulos CSS**: Use módulos CSS para todos os estilos específicos de componentes para evitar conflitos globais. Use `:global()` com moderação para sobrescritas de terceiros ou nomes de classe estáveis ​​para scripts externos (como o Toast).
3. **Nomenclatura**: Use `PascalCase` tanto para o diretório quanto para os arquivos (`Button/Button.astro`).

4. **Importações**: Prefira usar o alias `@components/` para caminhos de importação mais limpos.

## Categorias de Componentes

### Interface Primitiva (`src/components/ui/`)

Blocos de construção flexíveis e reutilizáveis ​​usados ​​em toda a aplicação.

- `Button`: Elemento principal de interação.

- `Card`: Contêiner de conteúdo.

- `IconWrapper`: Manipulador de ícones SVG.

- `Toast`: Sistema de notificação global.

### Componentes de Funcionalidade (`src/components/`)

Componentes que executam lógica de negócios específica ou representam grandes seções de uma página.

- `Header`: Navegação e identidade visual do site.

- `AdminTable`: Tabela genérica para dados administrativos.

- `Contact`: Formulário e seção de contato.
