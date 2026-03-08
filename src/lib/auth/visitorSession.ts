import type { AstroCookies } from 'astro';

const SESSION_COOKIE = 'visitor_session';

export const getVisitorSession = (cookies: AstroCookies): string => {
  let sessionId = cookies.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    sessionId = 'v-' + Math.random().toString(36).substring(2, 15);
    cookies.set(SESSION_COOKIE, sessionId, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return sessionId;
};
