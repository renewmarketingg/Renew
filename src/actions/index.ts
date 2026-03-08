import { z } from 'astro/zod';
import { ActionError, defineAction } from 'astro:actions';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const InputSchema = z.object({
  email: z.string().trim().max(255, 'Email is too long').email('Invalid email address'),

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

export const server = {
  send: defineAction({
    accept: 'form',
    input: InputSchema,
    handler: async (input) => {
      const { name, email, message } = input;

      const { data, error } = await resend.emails.send({
        from: `Renew <delivered@resend.dev>`,
        to: 'renewmarketingg@gmail.com',
        subject: 'Mensagem site Renew',
        html: `<strong>It works!</strong><br /><p>name: ${name}</p><br /><p>email: ${email}</p><br /><p>message: ${message}</p>`,
      });

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return data;
    },
  }),
};
