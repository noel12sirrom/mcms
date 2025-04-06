import { defineConfig } from 'vite'

export default defineConfig({
  root: './src', 
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000' // adjust Flask port accordingly
    },
  }
})