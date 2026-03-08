# API Endpoints - Renew Digital

Este documento descreve os endpoints da API disponíveis no projeto.

## Carrinho de Compras

### GET /api/cart

Retorna todos os itens do carrinho para a sessão atual.

**Response:**

```json
[
  {
    "id": "cart-item-1",
    "productId": "prod-123",
    "quantity": 2,
    "name": "Produto Exemplo",
    "price": 299.9,
    "image": "/images/produto.jpg"
  }
]
```

---

### POST /api/cart

Adiciona um item ao carrinho.

**Request Body:**

```json
{
  "productId": "prod-123",
  "quantity": 1
}
```

**Response (201 Created):**

```json
{
  "id": "cart-item-1",
  "sessionId": "v-abc123",
  "productId": "prod-123",
  "quantity": 1,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Erros:**

- 400: Validação falhou (dados inválidos)
- 500: Erro interno

---

### PUT /api/cart/[productId]

Atualiza a quantidade de um item no carrinho.

**Request Body:**

```json
{
  "quantity": 3
}
```

**Response (200 OK):**

```json
{
  "productId": "prod-123",
  "quantity": 3
}
```

**Comportamento especial:**

- Se `quantity = 0`, o item é removido do carrinho

---

### DELETE /api/cart

Limpa todos os itens do carrinho para a sessão atual.

**Response:** 204 No Content

---

## Autenticação (Owner)

### POST /api/auth/owner/login

Realiza login como proprietário/admin.

**Request Body:**

```json
{
  "email": "admin@exemplo.com",
  "password": "senha123"
}
```

**Response (303 Redirect):**

Redireciona para a URL especificada ou `/admin`.

**Erros:**

- 401: Credenciais inválidas
- 429: Muitas tentativas (rate limiting)

**Segurança:**

- Rate limiting: máximo 5 tentativas por IP
- Bloqueio de 15 minutos após exceder limite

---

### POST /api/auth/owner/logout

Realiza logout do proprietário.

**Response:** Redirect para home

---

## Produtos

### GET /api/products

Lista todos os produtos.

**Response:**

```json
[
  {
    "id": "prod-123",
    "name": "Produto Exemplo",
    "description": "Descrição do produto",
    "price": 299.9,
    "originalPrice": 399.9,
    "image": "/images/produto.jpg",
    "affiliateLink": "https://loja.com/produto",
    "category": "Eletrônicos",
    "rating": 4.5,
    "reviews": 150,
    "featured": true
  }
]
```

---

### GET /api/products/[id]

Retorna um produto específico.

---

## Autenticação de Sessão

O sistema utiliza cookies para gerenciar sessões:

- **Visitor**: Cookie `visitor_session` (30 dias, httpOnly)
- **Owner**: Cookie `renew_admin_session` (httpOnly, assinado com HMAC)

---

## Códigos de Status

| Código | Descrição             |
| ------ | --------------------- |
| 200    | OK                    |
| 201    | Created               |
| 204    | No Content            |
| 303    | Redirect              |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 404    | Not Found             |
| 429    | Too Many Requests     |
| 500    | Internal Server Error |
