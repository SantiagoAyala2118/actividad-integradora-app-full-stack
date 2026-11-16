import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // En desarrollo local lee el .env de la raíz del repo. En Docker, VITE_API_URL llega como build arg.
  envDir: '..',
  server: { port: 5173 },
  preview: { port: 5173, host: true },
});
