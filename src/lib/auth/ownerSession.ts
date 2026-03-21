import type { AstroCookies } from 'astro';

const COOKIE_NAME = 'renew_admin_session';

const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const base64UrlEncode = (input: Uint8Array | string): string => {
  if (typeof input === 'string') {
    input = new TextEncoder().encode(input);
  }
  const bytes = new Uint8Array(input);
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    result += base64Chars[b1 >> 2];
    result += base64Chars[((b1 & 3) << 4) | (b2 >> 4)];
    result += i + 1 < bytes.length ? base64Chars[((b2 & 15) << 2) | (b3 >> 6)] : '=';
    result += i + 2 < bytes.length ? base64Chars[b3 & 63] : '=';
  }
  return result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const base64UrlDecode = (input: string): Uint8Array => {
  const pad = input.length % 4;
  const padded = input + (pad ? '='.repeat(4 - pad) : '');
  const normalized = padded.replace(/-/g, '+').replace(/_/g, '/');
  const chars: number[] = [];
  for (let i = 0; i < normalized.length; i += 4) {
    const b1 = base64Chars.indexOf(normalized[i]);
    const b2 = base64Chars.indexOf(normalized[i + 1]);
    const b3 = base64Chars.indexOf(normalized[i + 2]);
    const b4 = base64Chars.indexOf(normalized[i + 3]);
    chars.push((b1 << 2) | (b2 >> 4));
    if (b3 !== -1) chars.push(((b2 & 15) << 4) | (b3 >> 2));
    if (b4 !== -1) chars.push(((b3 & 3) << 6) | b4);
  }
  return new Uint8Array(chars);
};

const sign = async (payloadB64: string, secret: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  return base64UrlEncode(new Uint8Array(signature));
};

export const getOwnerSessionCookieName = (): string => {
  return COOKIE_NAME;
};

export const getOwnerSessionSecret = (): string => {
  const secret = import.meta.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET não está configurado. Defina a variável de ambiente.');
  }
  if (secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET deve ter pelo menos 32 caracteres.');
  }
  return secret;
};

export const createOwnerSessionToken = async (
  email: string,
  maxAgeSeconds = 60 * 60 * 24 * 7
): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    email,
    iat: now,
    exp: now + maxAgeSeconds,
  };

  const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await sign(payloadB64, getOwnerSessionSecret());
  return `${payloadB64}.${sig}`;
};

export const verifyOwnerSessionToken = async (
  token: string | undefined | null
): Promise<{ email: string } | null> => {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, sig] = parts;
  const expected = await sign(payloadB64, getOwnerSessionSecret());

  const a = base64UrlDecode(sig);
  const b = base64UrlDecode(expected);

  if (a.length !== b.length) return null;

  let equal = true;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      equal = false;
      break;
    }
  }
  if (!equal) return null;

  try {
    const payloadBytes = base64UrlDecode(payloadB64);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr) as { email?: string; exp?: number };
    if (!payload.email || !payload.exp) return null;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return { email: payload.email };
  } catch {
    return null;
  }
};

export const setOwnerSessionCookie = (
  cookies: AstroCookies,
  token: string,
  maxAgeSeconds = 60 * 60 * 24 * 7
): void => {
  cookies.set(getOwnerSessionCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: maxAgeSeconds,
  });
};

export const clearOwnerSessionCookie = (cookies: AstroCookies): void => {
  cookies.delete(getOwnerSessionCookieName(), { path: '/' });
};

export const hasValidOwnerSession = async (cookies: AstroCookies): Promise<boolean> => {
  const token = cookies.get(getOwnerSessionCookieName())?.value;
  if (!token) return false;
  const result = await verifyOwnerSessionToken(token);
  return Boolean(result);
};
