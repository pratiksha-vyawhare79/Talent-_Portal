import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev config when running from src/frontend
export default defineConfig({
  plugins: [react()],
  root: '.',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
