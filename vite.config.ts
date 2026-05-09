import { defineConfig } from 'vite';
// import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  // Production build: serve under /games/crash/
  // Dev server: serve at root so http://localhost:3000 works directly
  base: command === 'build' ? '/games/crash/' : '/',
  server: {
    port: 3000,
    open: true,
  },
//   plugins: [tailwindcss()],
}));