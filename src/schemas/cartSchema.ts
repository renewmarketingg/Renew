import { z } from 'astro/zod';

export const CartItemSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  createdAt: z.date(),
});

export const AddToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
});

export const UpdateCartQtySchema = z.object({
  quantity: z.number().int().nonnegative(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
