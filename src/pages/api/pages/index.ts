import { getPublicPages } from '@/lib/pages-config';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const pages = getPublicPages();
    return new Response(JSON.stringify(pages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
