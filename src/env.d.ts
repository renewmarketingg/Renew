interface ImportMetaEnv {
  readonly ADMIN_OWNER_EMAIL?: string;
  readonly ADMIN_PASSWORD_HASH?: string;
  readonly ADMIN_SESSION_SECRET?: string;
  readonly OPENAI_API_KEY?: string;
  readonly ANTHROPIC_API_KEY?: string;
  readonly GEMINI_API_KEY?: string;
  readonly MISTRAL_API_KEY?: string;
  readonly GROQ_API_KEY?: string;
  readonly COHERE_API_KEY?: string;
  readonly GOOGLE_SECRET?: string;
  readonly GOOGLE_CLIENT_ID?: string;
  readonly GOOGLE_REFRESH_TOKEN?: string;
  readonly ASTRO_DB_REMOTE_URL?: string;
  readonly ASTRO_DB_APP_TOKEN?: string;
  readonly RESEND_API_KEY?: string;
  readonly VERCEL_OIDC_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
