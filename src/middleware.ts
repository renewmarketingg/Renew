import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher(['/admin(.*)']);

export const onRequest = clerkMiddleware(async (auth, context, next) => {
  if (isProtectedRoute(context.request)) {
    const { userId, redirectToSignIn } = auth();

    if (!userId) {
      return redirectToSignIn();
    }
  }

  return next();
});
