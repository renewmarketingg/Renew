import { hasValidOwnerSession } from '@lib/auth/ownerSession';
import { defineMiddleware } from 'astro:middleware';

const isProtectedRoute = (pathname: string) => pathname.startsWith('/admin');

export const onRequest = defineMiddleware(async ({ url, cookies }, next) => {
  if (isProtectedRoute(url.pathname)) {
    if (!(await hasValidOwnerSession(cookies))) {
      return Response.redirect(new URL('/', url), 303);
    }
  }

  return next();
});
