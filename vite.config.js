import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Esto asegura una configuración de red limpia y localhost
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
})
