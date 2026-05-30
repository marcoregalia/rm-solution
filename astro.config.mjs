import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const EXCLUDED_PAGES = [
  'https://www.rm-solution.it/contatti/grazie/',
  'https://www.rm-solution.it/privacy/',
  'https://www.rm-solution.it/cookie/',
  'https://www.rm-solution.it/note-legali/',
];

export default defineConfig({
  site: 'https://www.rm-solution.it',
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED_PAGES.includes(page),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
