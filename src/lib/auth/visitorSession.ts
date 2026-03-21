import type { AstroCookies } from 'astro';
import { generateSessionId } from '@/utils/id';

const SESSION_COOKIE = 'visitor_session';

export const getVisitorSession = (cookies: AstroCookies): string => {
  let sessionId = cookies.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    sessionId = generateSessionId();
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
