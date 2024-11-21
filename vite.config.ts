import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/marvin': {
        target: 'http://localhost:8080', // Replace with your Express server port
        changeOrigin: true,
      },
    },
  },
});
