import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    // Kod bölme (Code Splitting) ve küçültme ayarları
    minify: 'terser', 
    terserOptions: {
      compress: {
        drop_console: true, // Production'da console logları siler, JS boyutunu düşürür
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Vendor (kütüphane) kodlarını ayrı dosyalara böler, cache avantajı sağlar
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // CSS dosyalarını tek bir parça yerine modüler bırakmak istersen:
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // 4kb altındaki dosyaları base64 yaparak istek sayısını azaltır
  },
})