import type { APIRoute } from 'astro';

export const PUT: APIRoute = async ({ params }) => {
  const { productId } = params;
  return new Response(JSON.stringify({ success: true, productId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const { productId } = params;
  return new Response(JSON.stringify({ success: true, productId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
