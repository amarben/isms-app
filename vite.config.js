import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['docx']
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  }
})