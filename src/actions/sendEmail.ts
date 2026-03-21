import { escapeHtml } from '@/utils/format';
import { z } from 'astro/zod';
import { ActionError, defineAction } from 'astro:actions';
import { Resend } from 'resend';

if (!import.meta.env.RESEND_API_KEY) {
  throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Missing RESEND_API_KEY' });
}

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const InputSchema = z.object({
  email: z.email('Invalid email address').trim().max(255, 'Email is too long'),

  name: z
    .string()
    .trim()
    .max(100, 'Name is too long')
    .min(2, 'Name must have at least 2 characters'),

  message: z
    .string()
    .trim()
    .max(2000, 'Message is too long')
    .min(10, 'Message must have at least 10 characters'),
});

export const sendEmail = defineAction({
  accept: 'form',
  input: InputSchema,
  handler: async (input) => {
    const safeName = escapeHtml(input.name);
    const safeEmail = escapeHtml(input.email);
    const safeMessage = escapeHtml(input.message);

    const { data, error } = await resend.emails.send({
      from: `Renew <delivered@resend.dev>`,
      to: 'renewmarketingg@gmail.com',
      subject: 'Mensagem site Renew',
      text: `
        Nome: ${input.name}
        Email: ${input.email}
        Mensagem: ${input.message}
      `,
      html: `
        <h2>Nova mensagem do site</h2>
        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${safeMessage.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: error.message,
      });
    }

    return data;
  },
});
