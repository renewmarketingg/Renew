import type { APIRoute } from 'astro';
import { PROVIDERS } from '@lib/ai/providers';

export const GET: APIRoute = async () => {
  const providers = PROVIDERS.map((p) => ({
    id: p.id,
    name: p.name,
    apiKeyUrl: p.apiKeyUrl,
    hasApiKey: p.hasApiKey,
  }));

  return new Response(JSON.stringify({ providers }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
