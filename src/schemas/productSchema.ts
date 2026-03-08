import { z } from 'astro/zod';

export const ProductSchema = z.object({
  id: z.string().min(1, 'O ID é obrigatório'),
  name: z.string().min(1, 'O nome é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  price: z.number().positive('O preço deve ser maior que zero'),
  originalPrice: z.number().positive('O preço original deve ser maior que zero').optional(),
  image: z.string().url('A imagem deve ser uma URL válida'),
  affiliateLink: z.string().url('O link de afiliado deve ser uma URL válida'),
  category: z.string().min(1, 'A categoria é obrigatória'),
  rating: z.number().min(0).max(5).default(5),
  reviews: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
});

export type Product = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
