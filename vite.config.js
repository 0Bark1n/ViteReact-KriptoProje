import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin() // CSS'i tekrar içeri gömüyoruz çünkü dosyan çok küçük (5kb)
  ],
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined, // Dosyaları bölme, tek parça (bundle) yap
      },
    },
  },
})