import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' keeps every path relative, so the built site works from any host or folder.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: { target: 'es2020', assetsInlineLimit: 0, chunkSizeWarningLimit: 900 },
  server: { host: true },
  preview: { host: true, port: 4173 },
})
