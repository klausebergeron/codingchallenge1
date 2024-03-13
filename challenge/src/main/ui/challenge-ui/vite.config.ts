import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
      proxy: {
        '/favorites': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        }
    }
  }
})
