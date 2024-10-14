import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias @ trỏ tới thư mục src
      '~': path.resolve(__dirname, './src'), // Alias ~ trỏ tới thư mục src (nếu cần)
    },
  },
});
