import type { CartItem } from '@/types';

const API_BASE = '/api/cart';

export const getCartFromServer = async (): Promise<CartItem[]> => {
  try {
    const res = await fetch(API_BASE);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Cart fetch failed', e);
  }
  return [];
};

export const addToCartServer = async (
  productId: string,
  _productName: string
): Promise<boolean> => {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const updateQuantityServer = async (
  productId: string,
  quantity: number
): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const removeFromCartServer = async (productId: string): Promise<boolean> => {
  return updateQuantityServer(productId, 0);
};

export const clearCartServer = async (): Promise<boolean> => {
  try {
    const res = await fetch(API_BASE, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
};
