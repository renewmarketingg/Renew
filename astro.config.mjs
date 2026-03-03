// @ts-check
import db from '@astrojs/db';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import clerk from '@clerk/astro';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://renewdigital.com.br',
  integrations: [
    db(),
    clerk(),
    sitemap(),
    icon({
      iconDir: './src/icons',
    }),
  ],
});
