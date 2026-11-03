import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://luisaalcantara.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
