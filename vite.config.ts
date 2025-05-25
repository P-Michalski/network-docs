import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/network-docs/',
  
  server: {
    middlewareMode: false,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
