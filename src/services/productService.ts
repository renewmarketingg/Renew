import { db, eq, Products } from 'astro:db';
import type { CreateProductInput } from '../schemas/productSchema';
import { generateProductId } from '@/utils/id';

export async function getProducts() {
  return await db.select().from(Products);
}

export async function getProductById(id: string) {
  const result = await db.select().from(Products).where(eq(Products.id, id));
  return result[0] || null;
}

export async function createProduct(input: CreateProductInput) {
  const newProduct = {
    ...input,
    id: generateProductId(),
    createdAt: new Date(),
  };

  await db.insert(Products).values(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, input: Partial<CreateProductInput>) {
  await db.update(Products).set(input).where(eq(Products.id, id));
  return { id, ...input };
}

export async function deleteProduct(id: string) {
  await db.delete(Products).where(eq(Products.id, id));
}
