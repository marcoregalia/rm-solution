import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.rm-solution.it',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
