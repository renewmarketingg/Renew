interface ImportMetaEnv {
  readonly ADMIN_OWNER_EMAIL?: string;
  readonly ADMIN_PASSWORD?: string;
  readonly GOOGLE_SECRET?: string;
  readonly GOOGLE_CLIENT_ID?: string;
  readonly GOOGLE_REFRESH_TOKEN?: string;
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  readonly CLERK_SECRET_KEY: string;
  readonly ASTRO_DB_REMOTE_URL?: string;
  readonly ASTRO_DB_APP_TOKEN?: string;
  readonly RESEND_API_KEY?: string;
  readonly VERCEL_OIDC_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
