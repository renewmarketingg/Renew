# Sistema de Loja - Renew Digital

Este documento descreve o funcionamento do sistema de loja e carrinho de compras do projeto.

## Visão Geral

O sistema de loja oferece duas modalidades de produtos:

1. **Produtos do Banco de Dados**: Produtos gerenciados via painel admin
2. **Produtos de Afiliado**: Produtos de demonstração carregados via constante

## Arquitetura

### Estrutura de Arquivos

```
src/
├── pages/
│   └── store.astro          # Página principal da loja (SSR)
├── lib/
│   └── cart/
│       ├── index.ts         # Exportações públicas
│       ├── api.ts           # Comunicação com API
│       └── client.ts        # Inicialização e eventos do carrinho
├── types/
│   └── index.ts             # Tipos TypeScript (Product, CartItem, etc)
├── services/
│   └── productService.ts    # Acesso aos produtos do banco
└── constants/
    └── affiliateProducts.ts # Produtos de demonstração
```

### Abordagem SSR (Server-Side Rendering)

A página da loja (`store.astro`) renderiza os produtos no servidor, enviando HTML completo para o cliente. Isso resulta em:

- **Melhor performance**: Menos JavaScript no cliente
- **SEO improved**: Conteúdo indexável pelos motores de busca
- **UX mais rápida**: Primeira renderização instantânea

O JavaScript cliente é usado apenas para:

- Abrir/fechar carrinho lateral
- Adicionar produtos ao carrinho
- Atualizar quantidades
- Filtros de busca (CSS-based)

### Módulos do Carrinho

#### `src/lib/cart/api.ts`

Responsável pela comunicação com os endpoints da API do carrinho.

- `getCartFromServer()` - Busca itens do carrinho
- `addToCartServer(productId, productName)` - Adiciona produto
- `updateQuantityServer(productId, quantity)` - Atualiza quantidade
- `removeFromCartServer(productId)` - Remove produto
- `clearCartServer()` - Limpa todo o carrinho

#### `src/lib/cart/client.ts`

Inicialização e gerenciamento de eventos do carrinho.

- `initCart()` - Inicializa o carrinho e eventos

## Modo Demo vs Produção

O sistema detecta automaticamente se há produtos no banco de dados:

```typescript
const dbProducts = await getProducts();
const isDemoMode = dbProducts.length === 0;
const products = isDemoMode ? affiliateProducts : dbProducts;
```

- **Modo Demo**: Exibe produtos de afiliado estáticos (definidos em `affiliateProducts.ts`)
- **Modo Produção**: Exibe produtos do banco de dados (Turso/SQLite)

## Estrutura de Dados

### Produto (`Product`)

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  affiliateLink: string;
  category: string;
  rating: number;
  reviews: number;
  featured: boolean;
  createdAt?: Date;
}
```

### Item do Carrinho (`CartItem`)

```typescript
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}
```

## Funcionalidades

### Filtros e Busca

- **Busca por texto**: Filtra por nome, descrição ou categoria
- **Filtro por categoria**: Botões para cada categoria disponível
- **URL params**: Estado persiste na URL (`?q=termo&category=Eletrônicos`)

### Carrinho de Compras

- **Adicionar**: Botão em cada produto
- **Atualizar quantidade**: Botões +/- no carrinho
- **Remover**: Botão de lixeira ou quantidade = 0
- **Limpar**: Botão para esvaziar o carrinho
- **Persistência**: Sessão via cookie `visitor_session`

## Adicionar Novos Produtos

### Via Banco de Dados (Produção)

1. Acesse o painel admin em `/admin`
2. Navegue para a seção de produtos
3. Adicione novo produto com todos os campos

### Via Código (Demo)

Edite `src/constants/affiliateProducts.ts`:

```typescript
const affiliateProducts: Product[] = [
  {
    id: 'novo-prod-1',
    name: 'Novo Produto',
    description: 'Descrição do produto',
    price: 299.9,
    originalPrice: 399.9,
    image: '/images/produto.jpg',
    affiliateLink: 'https://afiliado.com/produto',
    category: 'Eletrônicos',
    rating: 4.5,
    reviews: 150,
    featured: true,
  },
];
```

## Variáveis de Ambiente

Não requer variáveis de ambiente específicas para o funcionamento básico.
