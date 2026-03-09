# Schema do Banco de Dados - Renew Digital

Este documento descreve o schema do banco de dados utilizado no projeto (Astro DB / Turso SQLite).

## Visão Geral

O projeto utiliza **Astro DB** com driver **Turso (SQLite)** para persistência de dados.

**Arquivo de configuração:** `db/config.ts`

## Tabelas

### Users

Tabela de usuários do sistema (reservado para uso futuro).

```typescript
const Users = DefineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    email: column.text({ unique: true, notNull: true }),
    name: column.text(),
    password: column.text(),
    role: column.text({ default: 'admin' }),
    createdAt: column.date({ default: new Date() }),
  },
});
```

| Coluna    | Tipo | Constraints      | Descrição           |
| --------- | ---- | ---------------- | ------------------- |
| id        | TEXT | PK               | ID único do usuário |
| email     | TEXT | UNIQUE, NOT NULL | Email do usuário    |
| name      | TEXT | -                | Nome completo       |
| password  | TEXT | -                | Senha hash          |
| role      | TEXT | DEFAULT 'admin'  | Papel no sistema    |
| createdAt | DATE | DEFAULT NOW      | Data de criação     |

---

### Products

Tabela de produtos para a loja.

```typescript
const Products = DefineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    description: column.text(),
    price: column.number(),
    originalPrice: column.number({ optional: true }),
    image: column.text(),
    affiliateLink: column.text(),
    category: column.text(),
    rating: column.number({ default: 5 }),
    reviews: column.number({ default: 0 }),
    featured: column.boolean({ default: false }),
    createdAt: column.date({ default: new Date() }),
  },
});
```

| Coluna        | Tipo    | Constraints   | Descrição                               |
| ------------- | ------- | ------------- | --------------------------------------- |
| id            | TEXT    | PK            | ID único do produto                     |
| name          | TEXT    | -             | Nome do produto                         |
| description   | TEXT    | -             | Descrição detalhada                     |
| price         | NUMBER  | -             | Preço atual                             |
| originalPrice | NUMBER  | OPTIONAL      | Preço original (para calcular desconto) |
| image         | TEXT    | -             | URL da imagem                           |
| affiliateLink | TEXT    | -             | Link de afiliado                        |
| category      | TEXT    | -             | Categoria do produto                    |
| rating        | NUMBER  | DEFAULT 5     | Avaliação (1-5)                         |
| reviews       | NUMBER  | DEFAULT 0     | Número de avaliações                    |
| featured      | BOOLEAN | DEFAULT false | Produto em destaque                     |
| createdAt     | DATE    | DEFAULT NOW   | Data de criação                         |

---

### CartItems

Itens do carrinho de compras (por sessão).

```typescript
const CartItems = DefineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    sessionId: column.text(),
    productId: column.text({ references: () => Products.columns.id }),
    quantity: column.number({ default: 1 }),
    createdAt: column.date({ default: new Date() }),
  },
});
```

| Coluna    | Tipo   | Constraints      | Descrição                |
| --------- | ------ | ---------------- | ------------------------ |
| id        | TEXT   | PK               | ID único do item         |
| sessionId | TEXT   | -                | ID da sessão (visitante) |
| productId | TEXT   | FK → Products.id | Produto associado        |
| quantity  | NUMBER | DEFAULT 1        | Quantidade               |
| createdAt | DATE   | DEFAULT NOW      | Data de adição           |

---

## Relacionamentos

```
Products (1:N) - (0,N) CartItems
  └── Um produto pode estar em múltiplos carrinhos
  └── Cada carrinho pode ter múltiplos produtos
```

---

##seed de Dados

O arquivo `db/seed.ts` contém dados iniciais para desenvolvimento.

Para popular o banco:

```bash
pnpm db push   # Criar tabelas
astro db exec --remote --seed db/seed.ts  # Executar seed
```

---

## Consultas Comuns

### Obter carrinho com detalhes do produto

```typescript
const items = await db
  .select({
    id: CartItems.id,
    productId: CartItems.productId,
    quantity: CartItems.quantity,
    name: Products.name,
    price: Products.price,
    image: Products.image,
  })
  .from(CartItems)
  .innerJoin(Products, eq(CartItems.productId, Products.id))
  .where(eq(CartItems.sessionId, sessionId));
```

### Produtos em destaque

```typescript
const featured = await db.select().from(Products).where(eq(Products.featured, true));
```

---

## Migrações

Para fazer alterações no schema:

1. Edite `db/config.ts`
2. Execute `pnpm db push` para aplicar ao banco remoto
3. Se necessário, escreva migrações manuais para produção

---

## Variáveis de Ambiente

O banco de dados requer:

- `TURSO_DATABASE_URL` - URL do banco Turso
- `TURSO_AUTH_TOKEN` - Token de autenticação
