import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
          network: ['axios'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
  server: {
    host: '0.0.0.0',  // Listen on all interfaces
    port: 2026,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:2027',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
