import { verifyOwnerCredentials } from '@lib/auth/ownerCredentials';
import { createOwnerSessionToken, setOwnerSessionCookie } from '@lib/auth/ownerSession';
import { getRedirectUrlParam } from '@lib/auth/redirects';
import type { APIRoute } from 'astro';

const loginAttempts = new Map<string, { count: number; blockedUntil: number }>();

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000;

const sanitizeInput = (input: string): string => input.trim().slice(0, 254);

const getClientIP = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (attempt && attempt.blockedUntil > now) return false;
  if (attempt && attempt.count >= MAX_ATTEMPTS) {
    loginAttempts.set(ip, { count: attempt.count + 1, blockedUntil: now + BLOCK_DURATION_MS });
    return false;
  }

  if (attempt) {
    loginAttempts.set(ip, { count: attempt.count + 1, blockedUntil: 0 });
  } else {
    loginAttempts.set(ip, { count: 1, blockedUntil: 0 });
  }
  return true;
};

const toStringField = (value: FormDataEntryValue | null): string =>
  typeof value === 'string' ? value : '';

const isAjaxRequest = (request: Request): boolean => {
  const accept = request.headers.get('accept') || '';
  return accept.includes('application/json');
};

const redirectWithError = (url: URL, redirectUrl: string): Response => {
  const q = new URLSearchParams();
  q.set('error', '1');
  q.set('redirect_url', redirectUrl);
  return Response.redirect(new URL(`/login?${q.toString()}`, url).toString(), 303);
};

export const POST: APIRoute = async ({ request, cookies, url }) => {
  const clientIP = getClientIP(request);

  if (!checkRateLimit(clientIP)) {
    const errorMsg = 'Muitas tentativas de login. Tente novamente em 15 minutos.';
    if (isAjaxRequest(request)) {
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return redirectWithError(url, '/admin');
  }

  const form = await request.formData();
  const email = sanitizeInput(toStringField(form.get('email')));
  const password = toStringField(form.get('password'));
  const redirectUrl = toStringField(form.get('redirect_url')) || getRedirectUrlParam(url, '/admin');

  if (!email || !password) {
    if (isAjaxRequest(request)) {
      return new Response(JSON.stringify({ error: 'Email e senha são obrigatórios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return redirectWithError(url, redirectUrl);
  }

  const ok = await verifyOwnerCredentials({ email, password });
  if (!ok) {
    if (isAjaxRequest(request)) {
      return new Response(JSON.stringify({ error: 'Email ou senha inválidos' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return redirectWithError(url, redirectUrl);
  }

  loginAttempts.delete(clientIP);

  const token = await createOwnerSessionToken(ok.email);
  setOwnerSessionCookie(cookies, token);

  if (isAjaxRequest(request)) {
    return new Response(JSON.stringify({ success: true, redirectUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return Response.redirect(new URL(redirectUrl, url).toString(), 303);
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};
