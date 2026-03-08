import { UpdateCartQtySchema } from '@/schemas/cartSchema';
import { updateCartQty } from '@/services/cartService';
import { getVisitorSession } from '@lib/auth/visitorSession';
import type { APIRoute } from 'astro';

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  try {
    const { productId } = params;
    if (!productId) return new Response(null, { status: 400 });

    const sessionId = getVisitorSession(cookies);
    const body = await request.json();

    // Validation
    const { quantity } = UpdateCartQtySchema.parse(body);

    const updated = await updateCartQty(sessionId, productId, quantity);

    return new Response(JSON.stringify(updated), {
      status: 200,
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
