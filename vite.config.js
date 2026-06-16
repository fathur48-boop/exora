import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  server: {
    proxy: {
      '/api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api/, '/macros/s/YOUR_DEPLOYMENT_ID/exec'),
      },
    },
  },
})
