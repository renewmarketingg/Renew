import { and, CartItems, db, eq, Products } from 'astro:db';
import type { AddToCartInput } from '../schemas/cartSchema';
import type { Product } from '@/types';
import { generateCartId } from '@/utils/id';

let localProducts: Product[] = [];

export const setLocalProducts = (products: Product[]): void => {
  localProducts = products;
};

export const getCart = async (sessionId: string): Promise<unknown[]> => {
  try {
    const items = await db
      .select({
        id: CartItems.id,
        productId: CartItems.productId,
        quantity: CartItems.quantity,
        name: Products.name,
        price: Products.price,
        image: Products.image,
      })
      .from(CartItems)
      .innerJoin(Products, eq(CartItems.productId, Products.id))
      .where(eq(CartItems.sessionId, sessionId));

    return items;
  } catch (error) {
    console.warn('DB not available, using local cart storage');
    return getLocalCart(sessionId);
  }
};

const getLocalCart = (sessionId: string): unknown[] => {
  if (typeof localStorage === 'undefined') return [];
  const key = `renew_cart_${sessionId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalCart = (sessionId: string, items: unknown[]): void => {
  if (typeof localStorage === 'undefined') return;
  const key = `renew_cart_${sessionId}`;
  localStorage.setItem(key, JSON.stringify(items));
};

export const addToCart = async (sessionId: string, input: AddToCartInput): Promise<unknown> => {
  try {
    const existing = await db
      .select()
      .from(CartItems)
      .where(and(eq(CartItems.sessionId, sessionId), eq(CartItems.productId, input.productId)));

    if (existing.length > 0) {
      const item = existing[0];
      const newQty = item.quantity + input.quantity;
      await db.update(CartItems).set({ quantity: newQty }).where(eq(CartItems.id, item.id));
      return { ...item, quantity: newQty };
    }

    const newItem = {
      id: generateCartId(),
      sessionId,
      productId: input.productId,
      quantity: input.quantity,
      createdAt: new Date(),
    };

    await db.insert(CartItems).values(newItem);
    return newItem;
  } catch (error) {
    console.warn('DB not available, using local cart storage');
    return addToLocalCart(sessionId, input);
  }
};

const addToLocalCart = (sessionId: string, input: AddToCartInput): unknown => {
  const items = getLocalCart(sessionId) as Array<Record<string, unknown>>;
  const existingIndex = items.findIndex((item) => item.productId === input.productId);

  if (existingIndex >= 0) {
    items[existingIndex].quantity = (items[existingIndex].quantity as number) + input.quantity;
    saveLocalCart(sessionId, items);
    return items[existingIndex];
  }

  const product = localProducts.find((p) => p.id === input.productId);
  const newItem = {
    id: generateCartId(),
    sessionId,
    productId: input.productId,
    quantity: input.quantity,
    name: product?.name || 'Produto',
    price: product?.price || 0,
    image: product?.image || '',
  };

  items.push(newItem);
  saveLocalCart(sessionId, items);
  return newItem;
};

export const updateCartQty = async (
  sessionId: string,
  productId: string,
  quantity: number
): Promise<unknown> => {
  try {
    if (quantity <= 0) {
      await db
        .delete(CartItems)
        .where(and(eq(CartItems.sessionId, sessionId), eq(CartItems.productId, productId)));
      return null;
    }

    await db
      .update(CartItems)
      .set({ quantity })
      .where(and(eq(CartItems.sessionId, sessionId), eq(CartItems.productId, productId)));

    return { productId, quantity };
  } catch (error) {
    console.warn('DB not available, using local cart storage');
    return updateLocalCartQty(sessionId, productId, quantity);
  }
};

const updateLocalCartQty = (sessionId: string, productId: string, quantity: number): unknown => {
  const items = getLocalCart(sessionId) as Array<Record<string, unknown>>;
  const index = items.findIndex((item) => item.productId === productId);

  if (index < 0) return null;

  if (quantity <= 0) {
    items.splice(index, 1);
    saveLocalCart(sessionId, items);
    return null;
  }

  items[index].quantity = quantity;
  saveLocalCart(sessionId, items);
  return { productId, quantity };
};

export const clearCart = async (sessionId: string): Promise<void> => {
  try {
    await db.delete(CartItems).where(eq(CartItems.sessionId, sessionId));
  } catch (error) {
    console.warn('DB not available, using local cart storage');
    if (typeof localStorage !== 'undefined') {
      const key = `renew_cart_${sessionId}`;
      localStorage.removeItem(key);
    }
  }
};
