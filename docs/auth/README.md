# Sistema de Autenticação - Renew Digital

Este documento descreve o sistema de autenticação do projeto.

## Arquitetura

O sistema utiliza autenticação baseada em sessão segura com as seguintes características:

1. **Login Owner**: Acesso administrativo via credenciais seguras
2. **Proteção de Rotas**: Middleware que protege áreas administrativas
3. **Cookies Seguros**: Sessão armazenada em cookie httpOnly

---

## Sistema de Login

### Credenciais

O sistema usa credenciais definidas no arquivo `.env`:

```env
ADMIN_OWNER_EMAIL=seu-email@exemplo.com
ADMIN_PASSWORD=sua-senha-segura
ADMIN_SESSION_SECRET=sua-chave-secreta-minimo-32-caracteres
```

### Páginas

- **Login**: `/login` - Formulário de autenticação owner
- **Logout**: `/logout` - Encerra a sessão

### API

- **POST** `/api/auth/owner/login` - Autentica o usuário
- **POST** `/api/auth/owner/logout` - Encerra a sessão

---

## Medidas de Segurança

### 1. Assinatura HMAC

Tokens de sessão são assinados usando HMAC-SHA256:

```typescript
const sign = (payload: string, secret: string): string => {
  return createHmac('sha256', secret).update(payload).digest('base64');
};
```

### 2. Proteção contra Timing Attacks

Uso de `timingSafeEqual` para prevenir ataques de temporização:

```typescript
if (!timingSafeEqual(a, b)) return null;
```

### 3. Rate Limiting

O endpoint de login possui proteção contra brute force:

- **Máximo de 5 tentativas** por IP
- **Bloqueio de 15 minutos** após exceder o limite
- Retorna HTTP 429 quando bloqueado

### 4. Sanitização de Input

Todos os inputs são sanitizados antes do processamento:

- Email limitado a 254 caracteres
- Trim aplicado
- Validação de formato

### 5. Cookie Seguro

Configurações de segurança do cookie:

- `httpOnly: true` - Previne acesso via JavaScript
- `secure: true` - Apenas HTTPS em produção
- `sameSite: 'lax'` - Proteção CSRF
- `path: '/'` - Disponível em todo o site

### 6. Expiração de Token

Tokens expiram após 7 dias por padrão.

---

## Middleware de Proteção

O middleware protege rotas administrativas:

```typescript
const isProtectedRoute = (pathname: string) => pathname.startsWith('/admin');

export const onRequest = async ({ url, cookies }, next) => {
  if (isProtectedRoute(url.pathname)) {
    if (!hasValidOwnerSession(cookies)) {
      return Response.redirect(new URL('/', url), 303);
    }
  }
  return next();
};
```

---

## Variáveis de Ambiente Necessárias

```env
# Obrigatório - Credenciais do Owner
ADMIN_OWNER_EMAIL=admin@exemplo.com
ADMIN_PASSWORD=senha-muito-segura

# Recomendado - Chave para assinar sessões
ADMIN_SESSION_SECRET=sua-chave-secreta-minimo-32-caracteres
```

---

## Fluxo de Autenticação

1. Usuário acessa `/login`
2. Preenche email e senha
3. Sistema verifica credenciais
4. Se válido, cria token de sessão assinado
5. Armazena token em cookie seguro
6. Redireciona para `/admin`

---

## Boas Práticas

1. **Senha forte**: Mínimo 12 caracteres com letras, números e símbolos
2. **Chave de sessão**: Mínimo 32 caracteres aleatórios
3. **HTTPS**: Sempre usar HTTPS em produção
4. **Renovar sessão**: Considerar expiração mais curta para alta segurança
