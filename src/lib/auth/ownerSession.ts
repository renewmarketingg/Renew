import type { AstroCookies } from 'astro';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'renew_admin_session';

const base64UrlEncode = (input: Buffer | string): string => {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const base64UrlDecodeToString = (input: string): string => {
  const pad = input.length % 4;
  const padded = input + (pad ? '='.repeat(4 - pad) : '');
  const b64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(b64, 'base64').toString('utf8');
};

const sign = (payloadB64: string, secret: string): string => {
  return base64UrlEncode(createHmac('sha256', secret).update(payloadB64).digest());
};

export const getOwnerSessionCookieName = (): string => {
  return COOKIE_NAME;
};

export const getOwnerSessionSecret = (): string => {
  return import.meta.env.ADMIN_SESSION_SECRET || import.meta.env.CLERK_SECRET_KEY;
};

export const createOwnerSessionToken = (
  email: string,
  maxAgeSeconds = 60 * 60 * 24 * 7
): string => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    email,
    iat: now,
    exp: now + maxAgeSeconds,
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const sig = sign(payloadB64, getOwnerSessionSecret());
  return `${payloadB64}.${sig}`;
};

export const verifyOwnerSessionToken = (
  token: string | undefined | null
): { email: string } | null => {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, sig] = parts;
  const expected = sign(payloadB64, getOwnerSessionSecret());

  const a = new Uint8Array(Buffer.from(sig));
  const b = new Uint8Array(Buffer.from(expected));
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  try {
    const payloadStr = base64UrlDecodeToString(payloadB64);
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

export const hasValidOwnerSession = (cookies: AstroCookies): boolean => {
  const token = cookies.get(getOwnerSessionCookieName())?.value;
  return Boolean(verifyOwnerSessionToken(token));
};
