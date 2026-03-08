import type { OwnerCredentials } from '@types';

const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const getOwnerEmailFromEnv = (): string | null => {
  const direct = import.meta.env.ADMIN_OWNER_EMAIL?.trim();
  return direct ? normalizeEmail(direct) : null;
};

export const getOwnerCredentialsFromEnv = (): OwnerCredentials | null => {
  const email = getOwnerEmailFromEnv();
  const password = import.meta.env.ADMIN_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
};

export const verifyOwnerCredentials = (input: {
  email: string;
  password: string;
}): { email: string } | null => {
  const creds = getOwnerCredentialsFromEnv();
  if (!creds) return null;

  const email = normalizeEmail(input.email);
  const password = String(input.password);
  if (email !== creds.email) return null;
  if (password !== creds.password) return null;

  return { email };
};
