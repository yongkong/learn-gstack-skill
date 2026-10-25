import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lessonsPlugin } from './build/vite-plugin-lessons';

export default defineConfig({
  // 相对路径：同一份产物既能挂在根路径（WorkBuddy），也能挂在子路径（GitHub Pages 项目站）。
  // 站内用 hash 路由，文档路径不会随路由变化，所以相对 base 是安全的。
  base: './',
  plugins: [lessonsPlugin(), react()],
  server: { port: 5273, strictPort: true },
});
