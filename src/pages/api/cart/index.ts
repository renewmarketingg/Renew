import { AddToCartSchema } from '@/schemas/cartSchema';
import { addToCart, clearCart, getCart, setLocalProducts } from '@/services/cartService';
import { getVisitorSession } from '@lib/auth/visitorSession';
import type { APIRoute } from 'astro';
import affiliateProducts from '@/constants/affiliateProducts';

setLocalProducts(affiliateProducts as any);

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const sessionId = getVisitorSession(cookies);
    const cart = await getCart(sessionId);
    return new Response(JSON.stringify(cart), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = getVisitorSession(cookies);
    const body = await request.json();

    // Validation
    const validatedData = AddToCartSchema.parse(body);

    const newItem = await addToCart(sessionId, validatedData);

    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error.errors) {
      return new Response(JSON.stringify({ error: 'Validation failed', details: error.errors }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  try {
    const sessionId = getVisitorSession(cookies);
    await clearCart(sessionId);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
