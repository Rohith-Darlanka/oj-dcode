import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 👇 Replace PORT (e.g., 5000) with your actual backend port
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API calls to your Express backend
    },
  },
});
