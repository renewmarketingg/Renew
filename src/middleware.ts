import { hasValidOwnerSession } from '@lib/auth/ownerSession';
import { defineMiddleware } from 'astro:middleware';

const isProtectedRoute = (pathname: string) => pathname.startsWith('/admin');

const RATE_LIMIT_STORE = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000,
  MAX_REQUESTS: 100,
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const isRateLimited = (clientIp: string): boolean => {
  const now = Date.now();
  const clientData = RATE_LIMIT_STORE.get(clientIp);

  if (!clientData || now > clientData.resetTime) {
    RATE_LIMIT_STORE.set(clientIp, {
      count: 1,
      resetTime: now + RATE_LIMIT.WINDOW_MS,
    });
    return false;
  }

  if (clientData.count >= RATE_LIMIT.MAX_REQUESTS) {
    return true;
  }

  clientData.count++;
  return false;
};

const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, request } = context;
  const clientIp = getClientIp(request);

  if (isProtectedRoute(url.pathname)) {
    if (!(await hasValidOwnerSession(cookies))) {
      return Response.redirect(new URL('/', url), 303);
    }
  }

  if (url.pathname.startsWith('/api/')) {
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(RATE_LIMIT.WINDOW_MS / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(RATE_LIMIT.WINDOW_MS / 1000)),
            ...SECURITY_HEADERS,
          },
        }
      );
    }

    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
      const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
      const maxBodySize = 10 * 1024;

      if (contentLength > maxBodySize) {
        return new Response(JSON.stringify({ error: 'Request body too large' }), {
          status: 413,
          headers: {
            'Content-Type': 'application/json',
            ...SECURITY_HEADERS,
          },
        });
      }
    }
  }

  const response = await next();

  const headers = new Headers(response.headers);
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });

  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  headers.set('Pragma', 'no-cache');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
