import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lessonsPlugin } from './build/vite-plugin-lessons';

export default defineConfig({
  plugins: [lessonsPlugin(), react()],
  server: { port: 5273, strictPort: true },
});
