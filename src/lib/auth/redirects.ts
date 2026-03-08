export const getRedirectUrlParam = (url: URL, fallback = '/admin'): string => {
  const redirect = url.searchParams.get('redirect_url');
  return redirect && redirect.trim() ? redirect : fallback;
};

export const buildLoginRedirect = (currentUrl: URL, loginPath = '/login'): string => {
  const loginUrl = new URL(loginPath, currentUrl);
  loginUrl.searchParams.set('redirect_url', currentUrl.pathname + currentUrl.search);
  return loginUrl.toString();
};
