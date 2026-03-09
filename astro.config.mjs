// @ts-check
import { defineConfig } from 'astro/config';

import db from '@astrojs/db';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import icon from 'astro-icon';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    edgeMiddleware: true,
  }),
  site: 'https://renew-digital.vercel.app/',
  security: {
    allowedDomains: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'renew-digital.vercel.app' },
    ],
  },
  integrations: [
    db(),
    sitemap(),
    icon({
      iconDir: './src/icons',
    }),
  ],
});
