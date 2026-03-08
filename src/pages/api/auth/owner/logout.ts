import { clearOwnerSessionCookie } from '@lib/auth/ownerSession';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, url }) => {
  clearOwnerSessionCookie(cookies);
  return Response.redirect(new URL('/login', url).toString(), 303);
};

export const POST: APIRoute = async ({ cookies, url }) => {
  clearOwnerSessionCookie(cookies);
  return Response.redirect(new URL('/login', url).toString(), 303);
};
