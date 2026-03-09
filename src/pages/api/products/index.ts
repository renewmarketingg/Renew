import { CreateProductSchema } from '@/schemas/productSchema';
import { createProduct, getProducts } from '@/services/productService';
import { hasValidOwnerSession } from '@lib/auth/ownerSession';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const products = await getProducts();
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await hasValidOwnerSession(cookies))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();

    // Input Validation using Zod
    const validatedData = CreateProductSchema.parse(body);

    const newProduct = await createProduct(validatedData);

    return new Response(JSON.stringify(newProduct), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    // If it is a Zod Error, it means input validation failed (400)
    if (error.errors) {
      return new Response(JSON.stringify({ error: 'Validation failed', details: error.errors }), {
        status: 400,
      });
    }
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500 }
    );
  }
};
