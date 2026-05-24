import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://www.rm-solution.it',

  build: {
    inlineStylesheets: 'auto',
  },

  compressHTML: true,
  output: "hybrid",
  adapter: cloudflare()
});