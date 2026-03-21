import bcrypt from 'bcryptjs';
import { z } from 'astro/zod';

const EmailSchema = z.string().email('Email inválido').max(254);

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const getOwnerEmailFromEnv = (): string | null => {
  const raw = import.meta.env.ADMIN_OWNER_EMAIL;
  if (!raw) return null;
  try {
    return normalizeEmail(EmailSchema.parse(raw));
  } catch {
    return null;
  }
};

export const getOwnerHashedPasswordFromEnv = (): string | null => {
  return import.meta.env.ADMIN_PASSWORD_HASH || null;
};

export const isPasswordConfigured = (): boolean => {
  return Boolean(getOwnerEmailFromEnv() && getOwnerHashedPasswordFromEnv());
};

export const verifyOwnerCredentials = async (input: {
  email: string;
  password: string;
}): Promise<{ email: string } | null> => {
  const email = normalizeEmail(EmailSchema.parse(input.email));
  const expectedEmail = getOwnerEmailFromEnv();
  const plainPassword = import.meta.env.ADMIN_PASSWORD;
  const hashedPassword = getOwnerHashedPasswordFromEnv();

  if (!expectedEmail) return null;
  if (email !== expectedEmail) return null;

  if (plainPassword && String(input.password) === plainPassword) {
    return { email };
  }

  if (hashedPassword && hashedPassword.length > 20) {
    try {
      const isValid = await bcrypt.compare(String(input.password), hashedPassword);
      if (isValid) return { email };
    } catch {
      // bcrypt failed
    }
  }

  return null;
};
