import { db, eq, Products } from 'astro:db';
import type { CreateProductInput } from '../schemas/productSchema';

function generateId(): string {
  return 'prod-' + Math.random().toString(36).substring(2, 9);
}

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
    id: generateId(),
    createdAt: new Date(),
  };

  await db.insert(Products).values(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, input: Partial<CreateProductInput>) {
  await db.update(Products).set(input).where(eq(Products.id, id));
  // In a real sophisticated scenario we might select again to fetch the fully updated row.
  return { id, ...input };
}

export async function deleteProduct(id: string) {
  await db.delete(Products).where(eq(Products.id, id));
}
