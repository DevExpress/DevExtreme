import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@examples': path.resolve(__dirname, '../../examples')
    }
  },
  server: {
    port: 3001
  }
})
