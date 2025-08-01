import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 👈 Importa path

export default defineConfig({
  base: '/', // ruta base pública
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 Alias @ para acceder a src
    },
  },
  server: {
    proxy: {
      '/uploads': 'http://localhost:5000', // Redirige /uploads al backend
    },
  },
});
